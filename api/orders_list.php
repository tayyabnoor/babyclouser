<?php
require __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;

header('Content-Type: application/json');
$baseDir = dirname(__DIR__);
$env = Dotenv::createImmutable($baseDir);
$env->safeLoad();

$ordersDir = $baseDir . '/orders';
if (!is_dir($ordersDir)) {
    echo json_encode(['ok' => true, 'orders' => []]);
    exit;
}

$files = array_values(array_filter(scandir($ordersDir), function($f) use ($ordersDir) { return is_file($ordersDir . '/' . $f) && substr($f, -5) === '.json'; }));
$orders = [];
foreach ($files as $file) {
    $data = @file_get_contents($ordersDir . '/' . $file);
    if ($data) {
        $orders[] = json_decode($data, true);
    }
}

echo json_encode(['ok' => true, 'orders' => $orders]);

?>
