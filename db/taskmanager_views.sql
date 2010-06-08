--
-- Database: `taskmanager`
--
-- USE `taskmanager`;
-- --------------------------------------------------------


--
-- Structure for view `v_tasks`
--

CREATE OR REPLACE VIEW `v_tasks` AS 
select 	`a`.`id` AS `id`,
		`a`.`repo_id` AS `repo_id`,
		`a`.`title` AS `title`,
		`a`.`forum` AS `forum`,
		`a`.`prime` AS `prime`,
		`a`.`notes` AS `notes`,
		`a`.`date_due` AS `date_due`,
		`a`.`date_created` AS `date_created`,
		`a`.`user_id_created` AS `user_id_created`,
		`b`.`lastname` AS `lastame_created`,
		`b`.`firstname` AS `firstname_created`,
		`a`.`date_updated` AS `date_updated`,
		`a`.`user_id_updated` AS `user_id_updated`,
		`c`.`lastname` AS `lastname_updated`,
		`c`.`firstname` AS `firstname_updated`,
		`a`.`date_completed` AS `date_completed`,
		`a`.`user_id_completed` AS `user_id_completed`,
		`d`.`lastname` AS `lastname_completed`,
		`d`.`firstname` AS `firstname_completed`,
		`a`.`is_completed` AS `is_completed`,
		`a`.`is_archive` AS `is_archive`,
		`a`.`priority` AS `priority`,
		`a`.`date_added` AS `date_added`,
		`e`.`name` AS `NAME`,
		`e`.`description` AS `DESCRIPTION`,
		`e`.`create_date` AS `CREATE_DATE`,
		`e`.`create_user_id` AS `CREATE_USER_ID`,
		`a`.`date_created` AS `TASK_CREATE_DATE`,
		`a`.`date_completed` AS `TASK_COMPLETED_DATE` 
	from (
		(
			(
				(
					`tasks` `a` left join `users` `b` on((`a`.`user_id_created` = `b`.`id`))
				) 
				left join `users` `c` on((`a`.`user_id_updated` = `c`.`id`))
			) 
				left join `users` `d` on((`a`.`user_id_completed` = `d`.`id`))
		) 
		join `repos` `e` on((`a`.`repo_id` = `e`.`id`))
	);

	

--
-- Structure for view `v_repos_totals`
--

CREATE OR REPLACE VIEW `v_repos_totals` AS 
select 	ifnull(`v_tasks`.`id`,0) AS `ID`,
		ifnull(`v_tasks`.`repo_id`,0) AS `REPO_ID`,
		count(0) AS `TOTAL_TASKS`,
		(count(0) - sum(`v_tasks`.`is_archive`)) AS `TOTAL_INBOX`,
		sum((case when ((`v_tasks`.`is_archive` = 0) and (`v_tasks`.`is_completed` = 1)) then 1 else 0 end)) AS `TOTAL_INBOX_COMPLETED`,
		sum((case when ((`v_tasks`.`is_archive` = 0) and (`v_tasks`.`is_completed` = 0)) then 1 else 0 end)) AS `TOTAL_INBOX_OPEN`,
		sum(`v_tasks`.`is_archive`) AS `TOTAL_ARCHIVE`,
		sum((case when ((`v_tasks`.`is_archive` = 1) and (`v_tasks`.`is_completed` = 1)) then 1 else 0 end)) AS `TOTAL_ARCHIVE_COMPLETED`,
		sum((case when ((`v_tasks`.`is_archive` = 1) and (`v_tasks`.`is_completed` = 0)) then 1 else 0 end)) AS `TOTAL_ARCHIVE_OPEN`,
		sum((case when (`v_tasks`.`TASK_CREATE_DATE` > date_format((now() + interval -(1) day),'%Y-%m-%d')) then 1 else 0 end)) AS `TOTAL_NEW_TASKS`,
		sum((case when (`v_tasks`.`TASK_COMPLETED_DATE` > date_format((now() + interval -(1) day),'%Y-%m-%d')) then 1 else 0 end)) AS `TOTAL_NEW_CLOSE` 
	from `v_tasks`;

--
-- Structure for view `v_repos`
--

CREATE OR REPLACE VIEW `v_repos` AS 
select 	`a`.`id` AS `ID`,
		`a`.`id` AS `REPO_ID`,
		`a`.`name` AS `NAME`,
		`a`.`description` AS `DESCRIPTION`,
		`a`.`create_date` AS `CREATE_DATE`,
		`a`.`create_user_id` AS `CREATE_USER_ID`,
		`c`.`lastname` AS `CREATE_LASTNAME`,
		`c`.`firstname` AS `CREATE_FIRSTNAME`,
		CONCAT(`c`.`lastname`, ', ',`c`.`firstname`) AS `CREATE_FULLNAME`,
		ifnull(`b`.`TOTAL_TASKS`,0) AS `TOTAL_TASKS`,
		ifnull(`b`.`TOTAL_INBOX`,0) AS `TOTAL_INBOX`,
		ifnull(`b`.`TOTAL_INBOX_COMPLETED`,0) AS `TOTAL_INBOX_COMPLETED`,
		ifnull(`b`.`TOTAL_INBOX_OPEN`,0) AS `TOTAL_INBOX_OPEN`,
		ifnull(`b`.`TOTAL_ARCHIVE`,0) AS `TOTAL_ARCHIVE`,
		ifnull(`b`.`TOTAL_ARCHIVE_COMPLETED`,0) AS `TOTAL_ARCHIVE_COMPLETED`,
		ifnull(`b`.`TOTAL_ARCHIVE_OPEN`,0) AS `TOTAL_ARCHIVE_OPEN`,
		ifnull(`b`.`TOTAL_NEW_TASKS`,0) AS `TOTAL_NEW_TASKS`,
		ifnull(`b`.`TOTAL_NEW_CLOSE`,0) AS `TOTAL_NEW_CLOSE` 
	from (
		(
			`repos` `a` 
			left join `v_repos_totals` `b` on((`a`.`id` = `b`.`ID`))
		) 
		left join `users` `c` on((`a`.`create_user_id` = `c`.`id`))
	) 
	order by `a`.`id`;
	
--
-- Structure for view `v_privileges`
--

CREATE OR REPLACE VIEW `v_privileges` AS 
select 	`a`.`id` AS `ID`,
		`a`.`repo_id` AS `REPO_ID`,
		`b`.`NAME` AS `REPO_NAME`,
		`b`.`DESCRIPTION` AS `REPO_DESCRIPTION`,
		`a`.`privilege` AS `PRIVILEGE`,
		`c`.`id` AS `user_id`,
		`c`.`lastname` AS `lastname`,
		`c`.`firstname` AS `firstname`,
		`c`.`email` AS `EMAIL`,ifnull(`d`.`send_alert`,0) AS `SEND_ALERT`,
		`b`.`TOTAL_TASKS` AS `TOTAL_TASKS`,
		`b`.`TOTAL_INBOX` AS `TOTAL_INBOX`,
		`b`.`TOTAL_INBOX_COMPLETED` AS `TOTAL_INBOX_COMPLETED`,
		`b`.`TOTAL_INBOX_OPEN` AS `TOTAL_INBOX_OPEN`,
		`b`.`TOTAL_ARCHIVE` AS `TOTAL_ARCHIVE`,
		`b`.`TOTAL_ARCHIVE_COMPLETED` AS `TOTAL_ARCHIVE_COMPLETED`,
		`b`.`TOTAL_ARCHIVE_OPEN` AS `TOTAL_ARCHIVE_OPEN`,
		`b`.`TOTAL_NEW_TASKS` AS `TOTAL_NEW_TASKS`,
		`b`.`TOTAL_NEW_CLOSE` AS `TOTAL_NEW_CLOSE` 
	from (
		(
			(
				`privileges` `a` 
				join `v_repos` `b` on((`a`.`repo_id` = `b`.`ID`))
			) 
			join `users` `c` on((`a`.`user_id` = `c`.`id`))) 
			left join `settings` `d` on((`a`.`user_id` = `d`.`user_id`))
	);

