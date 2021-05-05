init:
	rm -f .git/hooks/pre-commit
	cp hooks/git/pre-commit .git/hooks/pre-commit
	chmod +x .git/hooks/pre-commit

start: docker-down docker-up

stop: docker-down

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

db-install: db-create db-import

db-create:
	docker-compose exec mysql mysql -u root -proot  -e "CREATE DATABASE localhost COLLATE 'utf8_general_ci';"

db-import:
	docker-compose exec mysql /bin/bash -c 'mysql -uroot -proot localhost < /database-dump/localhost.sql'

db-export:
	docker-compose exec mysql /bin/bash -c 'mysqldump -uroot -proot localhost > /database-dump/localhost.sql'
