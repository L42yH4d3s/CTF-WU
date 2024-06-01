<html>
    <body>
        <?php if (isset($_POST['dom'])): ?>
            <?php echo $_POST['dom']; ?>
        <?php else: ?>
            <p>Internal testing</p>
            <form action="index.php" method="post">
                <input type="text" name="dom" />
                <input type="submit" value="Submit" />
            </form>
        <?php endif; ?>
        <?php if (isset($_POST['readLog'])): ?>
            <?php 
                $logContent = file_get_contents('/var/log/wscorn.log');
                echo '<pre>' . htmlspecialchars($logContent) . '</pre>';
            ?>
        <?php else: ?>
            <form action="index.php" method="post">
                <input type="hidden" name="readLog" value="1" />
                <input type="submit" value="Read Log" />
            </form>
        <?php endif; ?>
    </body>
</html>