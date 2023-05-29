<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230529114046 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE files (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, path_name VARCHAR(255) NOT NULL, last_update VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE files_users (files_id INT NOT NULL, users_id INT NOT NULL, INDEX IDX_2EB13C22A3E65B2F (files_id), INDEX IDX_2EB13C2267B3B43D (users_id), PRIMARY KEY(files_id, users_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, uuid VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, date_sign_up VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, mail VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_1483A5E9D17F50A6 (uuid), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE files_users ADD CONSTRAINT FK_2EB13C22A3E65B2F FOREIGN KEY (files_id) REFERENCES files (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE files_users ADD CONSTRAINT FK_2EB13C2267B3B43D FOREIGN KEY (users_id) REFERENCES users (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE files_users DROP FOREIGN KEY FK_2EB13C22A3E65B2F');
        $this->addSql('ALTER TABLE files_users DROP FOREIGN KEY FK_2EB13C2267B3B43D');
        $this->addSql('DROP TABLE files');
        $this->addSql('DROP TABLE files_users');
        $this->addSql('DROP TABLE users');
    }
}
