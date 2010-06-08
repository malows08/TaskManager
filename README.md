# TaskManager

TaskMananager is a ExtJs web-based application for managing tasks individually or within a group.

Inspired by ExtJs Simple Task Demo.

For a live demo please visit:
[http://dev.vorento.com/TaskManager/](http://dev.vorento.com/TaskManager/)

## Features

  * Create Repositories of Tasks
  * Share these Repositories with other users (ADMIN and VIEW access)
  * Archive Tasks when completed
   
## Requirements

	* Apache 2.2
	* PHP 5.2
	* MySQL 5

## Installation

    $ git clone git://github.com/vinnybozz/TaskManager.git
	
    * Create DATABASE 'taskmanager' or other name

    * Create required Tables (db/taskmanager_tables.sql):
        - repos
        - tasks
        - privileges
        (- users table is included as a sample, you can replace or integrate your own)

    * Create required Views (db/taskmanager_views.sql):
        - v_repos_total
        - v_tasks
        - v_privileges
        - v_repos
        => MODIFY views to join with your own 'users' table

    * modify configs/app.ini.sample and rename app.ini. Include your own username and password (and dbname if not 'taskmanager') for connecting to MySQL.
		
    * The application can work as is by creating all required tables and views. However, to integrate into your own user table, some views will need to be modified as well as some php file to point to your own 'user' table.
		- views
			. v_privileges
			. v_repos
			. v_tasks
		- My_User.php
		- RepoAction.php (getUsers)

	* modify bootstrap, login and login_action to implement your own login

## Notes

* Zend Framework (Db_Statement_Mysqli.php) exhibited a strange bug that required the following fix:

View NOTES

## License

(The MIT License)

Copyright (c) 2010 Dan D.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
