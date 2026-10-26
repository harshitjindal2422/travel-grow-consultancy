<?php
/**
 * TravelGrow Consultancy - Database Manager
 * Robust MySQL PDO Connector with Automatic Schema Migrations & Prepared Statements
 */

namespace TravelGrow\Database;

use PDO;
use PDOException;

class Database
{
    private static ?Database $instance = null;
    private ?PDO $pdo = null;
    private bool $isConnected = false;
    private ?string $lastError = null;
    private string $fallbackStoragePath;

    private function __construct()
    {
        $this->fallbackStoragePath = dirname(__DIR__) . '/data/mysql_fallback_store.json';
        $this->connect();
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function connect(): bool
    {
        $config = require dirname(__DIR__) . '/config/database.php';

        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $config['host'],
            $config['port'],
            $config['database'],
            $config['charset']
        );

        try {
            // First attempt direct connection to travelgrow_db
            $this->pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
            $this->isConnected = true;
            $this->lastError = null;
            return true;
        } catch (PDOException $e) {
            // If database does not exist, try connecting to MySQL server directly and create database
            try {
                $serverDsn = sprintf('mysql:host=%s;port=%d;charset=%s', $config['host'], $config['port'], $config['charset']);
                $serverPdo = new PDO($serverDsn, $config['username'], $config['password'], $config['options']);
                $serverPdo->exec("CREATE DATABASE IF NOT EXISTS `{$config['database']}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
                
                // Now connect to newly created database
                $this->pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
                $this->isConnected = true;
                $this->lastError = null;
                $this->initSchema();
                return true;
            } catch (PDOException $innerException) {
                $this->isConnected = false;
                $this->lastError = $innerException->getMessage();
                error_log("TravelGrow MySQL Notice: " . $this->lastError);
                return false;
            }
        }
    }

    public function isConnected(): bool
    {
        return $this->isConnected;
    }

    public function getLastError(): ?string
    {
        return $this->lastError;
    }

    public function getPdo(): ?PDO
    {
        return $this->pdo;
    }

    /**
     * Executes schema.sql migration on MySQL
     */
    public function initSchema(): bool
    {
        if (!$this->isConnected || !$this->pdo) {
            return false;
        }

        $schemaFile = __DIR__ . '/schema.sql';
        if (!file_exists($schemaFile)) {
            return false;
        }

        try {
            $sql = file_get_contents($schemaFile);
            // Execute multiple statements
            $this->pdo->exec($sql);
            return true;
        } catch (PDOException $e) {
            error_log("TravelGrow Schema Migration Error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Execute parameterized SQL query
     */
    public function query(string $sql, array $params = []): ?\PDOStatement
    {
        if ($this->isConnected && $this->pdo) {
            try {
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute($params);
                return $stmt;
            } catch (PDOException $e) {
                error_log("SQL Query Error: " . $e->getMessage() . " | SQL: " . $sql);
                $this->lastError = $e->getMessage();
                return null;
            }
        }
        return null;
    }

    /**
     * Fetch single row from SQL
     */
    public function fetch(string $sql, array $params = []): ?array
    {
        $stmt = $this->query($sql, $params);
        if ($stmt) {
            $result = $stmt->fetch();
            return $result ?: null;
        }
        return null;
    }

    /**
     * Fetch all rows from SQL
     */
    public function fetchAll(string $sql, array $params = []): array
    {
        $stmt = $this->query($sql, $params);
        if ($stmt) {
            return $stmt->fetchAll();
        }
        return [];
    }

    /**
     * Insert row and return last inserted ID
     */
    public function insert(string $table, array $data): int|string
    {
        if ($this->isConnected && $this->pdo) {
            $columns = array_keys($data);
            $fields = implode('`, `', $columns);
            $placeholders = implode(', ', array_fill(0, count($columns), '?'));

            $sql = "INSERT INTO `{$table}` (`{$fields}`) VALUES ({$placeholders})";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute(array_values($data));
            return (int)$this->pdo->lastInsertId();
        }

        // If MySQL server is temporarily not running, store in fallback store so data is never lost
        return $this->fallbackInsert($table, $data);
    }

    /**
     * Fallback file persistence when MySQL is offline
     */
    private function fallbackInsert(string $table, array $data): int|string
    {
        $dir = dirname($this->fallbackStoragePath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $store = [];
        if (file_exists($this->fallbackStoragePath)) {
            $content = file_get_contents($this->fallbackStoragePath);
            $store = json_decode($content, true) ?: [];
        }

        if (!isset($store[$table])) {
            $store[$table] = [];
        }

        $id = count($store[$table]) + 1;
        $data['id'] = $id;
        $data['created_at'] = date('Y-m-d H:i:s');
        $store[$table][] = $data;

        file_put_contents($this->fallbackStoragePath, json_encode($store, JSON_PRETTY_PRINT));
        return $id;
    }

    /**
     * Retrieve fallback records if MySQL is offline
     */
    public function getFallbackRecords(string $table): array
    {
        if (file_exists($this->fallbackStoragePath)) {
            $content = file_get_contents($this->fallbackStoragePath);
            $store = json_decode($content, true) ?: [];
            return $store[$table] ?? [];
        }
        return [];
    }
}
