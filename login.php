<?php
/*!
 * TaskManager
 * Copyright(c) 2010 Dan D.
 * MIT Licensed
 */
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <title>Login Page</title>

    </head>

    <body>


        <div id="login_container">

            <div id="form_container">
                <form action="login_action.php" method="post" id="myFormId">
                    <?php if(isset($_GET['next_url']) && $_GET['next_url'] != '')
                        echo '<input type="hidden" name="next_url" value="' . urlencode($_GET['next_url']) .'" />';
                    ?>
                    <table>
                        <tr>
                            <td>User ID</td>
                            <td><input class="text" type="text" name="user_id" id="user_id" maxlength="7"/></td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td><input class="text" type="password" name="password" id="password"/></td>
                        </tr>
                    </table>
                    <input class="sbmt" type="submit" id="sbmt" value="Login" name="sbmt" />

                </form>
            </div>

            <hr />

        </div><!--end login-->

        <a href="logout.php">Logout</a>

    </body>
</html>