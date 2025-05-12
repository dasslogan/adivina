<?php
header('Content-Type: application/json');

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Return early for OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Helper function to connect to the database
function getDbConnection($host = null, $user = null, $password = null, $database = null) {
    // Default connection parameters (for XAMPP)
    $host = $host ?? 'localhost';
    $user = $user ?? 'root';
    $password = $password ?? '';
    $database = $database ?? 'tiktok_riddles';
    
    try {
        $conn = new mysqli($host, $user, $password, $database);
        
        if ($conn->connect_error) {
            throw new Exception("Connection failed: " . $conn->connect_error);
        }
        
        // Set UTF-8 character set
        $conn->set_charset("utf8mb4");
        
        return $conn;
    } catch (Exception $e) {
        // Return error as JSON
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
        exit();
    }
}

// Helper function to validate and sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Helper function to handle database errors
function handleDbError($conn, $sql, $error) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database error: ' . $error,
        'query' => $sql
    ]);
    $conn->close();
    exit();
}