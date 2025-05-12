<?php
require_once '../db.php';

// Handle GET request to fetch all riddles
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $conn = getDbConnection();
    
    // Get all riddles
    $sql = "SELECT * FROM riddles ORDER BY id DESC";
    $result = $conn->query($sql);
    
    if (!$result) {
        handleDbError($conn, $sql, $conn->error);
    }
    
    $riddles = [];
    while ($row = $result->fetch_assoc()) {
        $riddles[] = $row;
    }
    
    echo json_encode($riddles);
    $conn->close();
    exit();
}

// Handle invalid request methods
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);