
create table warehouse
(
    warehouse_ID int auto_increment primary key,
    address varchar(20) not null
);

create table shipping
(
    shipping_ID int auto_increment primary key,
    company_name not null,
    status varchar(20) not null,
    warehouse_ID int,
    foreign key (warehouse_ID) references warehouse (warehouse_ID)
);

create table order
(
    order_ID int auto_increment primary key,
    date datetime not null,
    address varchar(30) not null,
    phone_number varchar(20) not null,
    bank_number varchar(20) not null,
    shipping_ID int,
    foreign key (shipping_ID) references shipping (shipping_ID),
    user_ID int,
    foreign key (user_ID) references user (user_ID),
    cart_ID int,
    foreign key (cart_ID) references cart (cart_ID)
);

create table written_By
(
  ISBN varchar(15) primary key foreign key references book(ISBN) not null,
  author_ID int primary key foreign key references author(author_ID) not null,
);

create table book
(
    ISBN int auto_increment primary key,
    title varchar(50) not null,
    year varchar(4) not null,
    genre varchar(20) not null,
    page_count varchar(10) not null,
    price real not null,
    commission real not null,
    url varchar(100) not null,
    quantity int not null,
    warehouse_ID int,
    foreign key (warehouse_ID) references warehouse (warehouse_ID),
    publisher_ID int,
    foreign key (publisher_ID) references publisher (publisher_ID)
);

create table contains
(
    ISBN varchar(15) primary key foreign key references book(ISBN) not null,
    cart_ID int primary key foreign key references cart(cart_ID) not null,
    quantity int not null
);

create table cart
(
    cart_ID int auto_increment primary key
    
);

create table user
(
    user_ID auto_increment primary key,
    cart_ID int,
    foreign key (cart_ID) references cart (cart_ID),
    username varchar(20) not null,
    password varchar(20) not null,
    name varchar(20) not null,
    email varchar(30) not null,
    address varchar(30) not null,
    is_owner boolean not null,
);

create table publisher
(
    publisher_ID auto_increment primary key,
    name varchar(20) not null,
    address varchar(30) not null,
    email varchar(30) not null,
    bank_number varchar(20) not null
);

create table inst_phone
(
    publisher_ID varchar(20) primary key foreign key references publisher(publisher_ID) not null,
    phone_number auto_increment primary key
)