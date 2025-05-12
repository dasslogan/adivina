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

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get database configuration from request body
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['host']) || !isset($data['user']) || !isset($data['database'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required database configuration']);
    exit();
}

$host = $data['host'];
$user = $data['user'];
$password = $data['password'] ?? '';
$database = $data['database'];

// Connect to MySQL without selecting a database
try {
    $conn = new mysqli($host, $user, $password);
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Set UTF-8 character set
    $conn->set_charset("utf8mb4");
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit();
}

// Create the database if it doesn't exist
$sql = "CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";

if (!$conn->query($sql)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => "Error creating database: " . $conn->error]);
    $conn->close();
    exit();
}

// Select the database
$conn->select_db($database);

// Create the riddles table
$sql = "CREATE TABLE IF NOT EXISTS riddles (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

if (!$conn->query($sql)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => "Error creating riddles table: " . $conn->error]);
    $conn->close();
    exit();
}

// Create the players table
$sql = "CREATE TABLE IF NOT EXISTS players (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    player_id VARCHAR(255) NOT NULL UNIQUE,
    nickname VARCHAR(255) NOT NULL,
    correct_answers INT(11) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

if (!$conn->query($sql)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => "Error creating players table: " . $conn->error]);
    $conn->close();
    exit();
}

// Check if riddles table is empty
$result = $conn->query("SELECT COUNT(*) as count FROM riddles");
$row = $result->fetch_assoc();

// Add sample riddles if the table is empty
if ($row['count'] == 0) {
    $sampleRiddles = [
        ['question' => '¿Qué tiene dientes pero no puede morder?', 'answer' => 'peine'],
        ['question' => 'Tengo agujas pero no sé coser, tengo números pero no sé leer. ¿Qué soy?', 'answer' => 'reloj'],
        ['question' => 'Blanco por dentro, verde por fuera. Si quieres que te lo diga, espera. ¿Qué es?', 'answer' => 'pera'],
        ['question' => 'Todos pasan por mí, yo no paso por nadie. Todos preguntan por mí, yo no pregunto por nadie. ¿Qué soy?', 'answer' => 'tiempo'],
        ['question' => 'Soy pequeño como una nuez, subo las cuestas sin tener pies. ¿Qué soy?', 'answer' => 'caracol']
    ];
    
    $stmt = $conn->prepare("INSERT INTO riddles (question, answer) VALUES (?, ?)");
    
    foreach ($sampleRiddles as $riddle) {
        $stmt->bind_param("ss", $riddle['question'], $riddle['answer']);
        $stmt->execute();
    }
    
    $stmt->close();
}

// Create a sample.env file with database connection details
$envPath = "../../../.env";
$envContent = "# Database Connection\n";
$envContent .= "DB_HOST=$host\n";
$envContent .= "DB_USER=$user\n";
$envContent .= "DB_PASSWORD=$password\n";
$envContent .= "DB_NAME=$database\n";

if (file_put_contents($envPath, $envContent) === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => "Error writing environment file"]);
    $conn->close();
    exit();
}

// Return success message
$conn->close();
echo json_encode([
    'success' => true, 
    'message' => "Base de datos '$database' creada exitosamente con tablas 'riddles' y 'players'. Se agregaron 5 adivinanzas de ejemplo."
]);