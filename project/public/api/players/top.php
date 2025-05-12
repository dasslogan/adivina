<?php
require_once '../db.php';

// Handle GET request to fetch top players
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 5;
    
    // Ensure limit is a positive integer
    if ($limit <= 0) {
        $limit = 5;
    }
    
    $conn = getDbConnection();
    
    // Get top players
    $sql = "SELECT * FROM players ORDER BY correct_answers DESC LIMIT " . $limit;
    $result = $conn->query($sql);
    
    if (!$result) {
        handleDbError($conn, $sql, $conn->error);
    }
    
    $players = [];
    while ($row = $result->fetch_assoc()) {
        $players[] = [
            'id' => $row['player_id'],
            'nickname' => $row['nickname'],
            'correctAnswers' => $row['correct_answers']
        ];
    }
    
    echo json_encode($players);
    $conn->close();
    exit();
}

// Handle invalid request methods
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);