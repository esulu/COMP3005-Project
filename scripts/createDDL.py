import random

import requests
import urllib.parse
import json
# Book (ISBN, title, year, genre, page_count, price, commission, url, quantity, warehouse_ID, publisher_ID)
from bs4 import BeautifulSoup


def get_book_url(page: int = 1) -> str:
    return f"https://www.goodreads.com/list/show/7.Best_Books_of_the_21st_Century?page={page}"


def clamp(value: float, min_clamp: float, max_clamp: float) -> float:
    if value < min_clamp:
        return min_clamp
    if value > max_clamp:
        return max_clamp
    return value


publisher_key_map = {}
warehouse_key = 50000
init_publisher_key = 10000


def get_publisher_key(publisher: str) -> int:
    global init_publisher_key
    if publisher in publisher_key_map:
        return publisher_key_map[publisher]
    else:
        publisher_key_map[publisher] = init_publisher_key
        init_publisher_key += 1
        return init_publisher_key


bookTitles = []

for page in range(1, 2):
    bookUrl = get_book_url(page)
    req = requests.get(bookUrl)
    soup = BeautifulSoup(req.content, "html.parser")
    for a in soup.find_all('a', class_='bookTitle'):
        bookTitles.append(a.text.strip())

print(len(bookTitles))

for book in bookTitles:
    res = requests.get(
        f'https://www.googleapis.com/books/v1/volumes?q={urllib.parse.quote(book)}&maxResults=1&printType=books'
        f'&filter=ebooks')
    data = json.loads(res.text)
    if len(data['items']) != 1:
        continue
    json_data = data['items'][0]
    json_book = json_data['volumeInfo']
    json_sales = json_data['saleInfo']

    if len(json_book['industryIdentifiers']) == 0:
        continue
    isbn = json_book['industryIdentifiers'][0]['identifier']
    title = book
    if '-' in json_book['publishedDate']:
        year = json_book['publishedDate'][:json_book['publishedDate'].find('-')]
    else:
        year = json_book['publishedDate']
    genre = json_book['categories'][0]
    page_count = json_book['pageCount']
    publisher = json_book['publisher']
    url = json_book['imageLinks']['thumbnail']

    quantity = random.randint(10, 50)

    price = json_sales['listPrice']['amount']
    commission = clamp((price - json_sales['retailPrice']['amount']) / 150, 0.01, 0.5)
    print(f"INSERT INTO book VALUES({isbn}, {title}, {year}, {genre}, {page_count}, {price}, {commission},"
          f" {url}, {quantity}, {warehouse_key}, {get_publisher_key(publisher)})")
    if book.__contains__('Angels & Demons'):
        break

for publisher_key_pair in publisher_key_map.items():
    print(publisher_key_pair)
