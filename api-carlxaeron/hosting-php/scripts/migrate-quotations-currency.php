<?php
/**
 * Add optional currency column to quotations (PHP / USD from portfolio quote form).
 */
declare(strict_types=1);

$root = dirname(__DIR__);
require_once $root . '/src/bootstrap.php';

$pdo = db();

$hasColumn = (bool) $pdo->query("SHOW COLUMNS FROM quotations LIKE 'currency'")->fetch();
if ($hasColumn) {
    echo "quotations.currency already exists — nothing to do.\n";
    exit(0);
}

$pdo->exec('ALTER TABLE quotations ADD COLUMN currency VARCHAR(3) NULL AFTER budget_range');
echo "Added quotations.currency column.\n";
