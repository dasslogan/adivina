<?php
header('Content-Type: application/json');
require_once '../db.php';

// Handle GET request to fetch a random riddle
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $conn = getDbConnection();
        
        if (!$conn) {
            throw new Exception("Database connection failed");
        }
        
        // Get a random riddle
        $sql = "SELECT * FROM riddles ORDER BY RAND() LIMIT 1";
        $result = $conn->query($sql);
        
        if (!$result) {
            throw new Exception($conn->error);
        }
        
        if ($result->num_rows > 0) {
            $riddle = $result->fetch_assoc();
            echo json_encode($riddle);
        } else {
            // Return an empty riddle if no riddles found
            echo json_encode([
                'id' => 0,
                'question' => 'No hay adivinanzas disponibles. Agrega una en el panel de administración.',
                'answer' => 'ninguna'
            ]);
        }
        
        $conn->close();
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
        exit();
    }
}

// Handle invalid request methods
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);