drop table if exists users;

create table
  users(
    id uuid primary key not null,
    username varchar(50) not null,
    created_at timestamp default now() not null,
    email varchar(250) not null,
    password varchar(250) not null
);