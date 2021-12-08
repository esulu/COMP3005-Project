import random
import datetime
import requests
import urllib.parse
import json
from bs4 import BeautifulSoup

# https://www.randomlists.com/random-addresses
fake_addresses = [
    "8424 Ridge Court", "Gaspésie-Ouest, QC G0J 3T5", "9154 Tanglewood Court", "Owen Sound, ON N4K 2X1",
    "7 Prospect Rd.",
    "Cranbrook, BC V1C 9V7", "509 Smith Street", "Saint-Franþois, QC H7B 1V2", "9714 Orchard Lane",
    "Boucherville, QC J4B 6X3",
    "8535 Market Ave.", "Saint-Jacques, NB E7B 2H3", "3 Addison Ave.", "Stephenville, LB A2N 0P2", "76 Lake View Rd.",
    "Similkameen, BC V0X 9K2",
    "763 Glendale Ave.", "Nelson, BC V1L 1J0", "51 Devon St.", "Delhi, ON N4B 8Y2", "94 Berkshire Street",
    "Essex, ON N0R 5N0",
    "868 Poor House Street", "Amherstburg, ON N9V 7A9", "8711 Acacia Rd.", "Bouctouche, NB E4S 9N1",
    "762 Winchester St.",
    "Chatham, QC J8G 7R2", "483 Surrey Lane", "Bridgewater, NS B4V 8Y3", "897 Lafayette Road", "Devon, AB T9G 8H7",
    "7 East Courtland Ave.",
    "Lower Skeena, BC V0V 4P7", "209 West Circle St.", "Centreville, NB E7K 2H2", "7284 Golf Dr.",
    "Etobicoke, ON M8V 9P6", "8462 Sycamore Ave.",
    "Gloucester, ON K1B 7Y2", "552 Fulton Dr.", "Stouffville, ON L4A 2K5", "46 Rockledge St.", "Hartland, NB E7P 4P5",
    "892 West Harrison Court",
    "Gananoque, ON K7G 7Y5", "54 Branch Drive", "Balmoral, NB E8E 7B4", "298 E. Beacon St.", "Bradford, ON L3Z 4T8",
    "86 Longbranch Road",
    "Montmagny, QC G5V 0K4", "97 Academy Road", "Elliot Lake, ON P5A 8S0", "48 8th Lane", "Big Bras d'Or, NS B1X 4N2",
    "7175 Arlington Street",
    "Selkirk, MB R1A 9G4", "100 Pennington Drive", "Saint-Félicien, QC G8K 9L2"
]

fake_addresses = [address.replace(',', '').replace('\'', '').replace('\"','') for address in fake_addresses]
"""
# https://randommer.io/random-email-address
fake_emails = [
    "velda58@gmail.com", "jacky_ondricka@yahoo.com", "clarissa_king88@hotmail.com", "melvin_welch91@gmail.com",
    "chase.jenkins@hotmail.com",
    "citlalli_king7@yahoo.com", "theron5@yahoo.com", "pierce_ledner63@yahoo.com", "sheridan82@yahoo.com",
    "nick_robel@gmail.com",
    "torrey_beahan69@yahoo.com", "marlen.schaefer@hotmail.com", "marlon_spinka73@gmail.com", "rey93@hotmail.com",
    "verner.wiza@gmail.com",
    "bradford_green@gmail.com", "maverick.ryan52@gmail.com", "stella_kertzmann@gmail.com",
    "marshall.dicki75@hotmail.com",
    "rick.lynch@gmail.com", "frieda_watsica@gmail.com", "arianna68@yahoo.com", "noel31@yahoo.com",
    "penelope_schinner3@hotmail.com",
    "loren_mcdermott55@hotmail.com", "wendell39@hotmail.com", "adelia.oberbrunner@gmail.com", "granville93@yahoo.com",
    "marlon.dietrich@hotmail.com", "bradly70@yahoo.com"
]
"""
fake_emails = ["@gmail.com", "@yahoo.com", "@outlook.com"]
fake_company_name = ["Intact Courier", "Econofast Shipping", "Canada Post", "USPS", "Fedex"]
fake_status = ["Received", "In Transit", "Delivered"]
fopen = open('populate.ddl', 'w')


def get_book_url(page: int = 1) -> str:
    # gets a page of a goodreads list for a link (100 pages)
    return f"https://www.goodreads.com/list/show/7.Best_Books_of_the_21st_Century?page={page}"


def clamp(value: float, min_clamp: float, max_clamp: float) -> float:
    # clamps a value to a range of [min_clam, max_clamp]
    if value < min_clamp:
        return min_clamp
    if value > max_clamp:
        return max_clamp
    return value

# Variables for this script
publisher_key_map = {}
init_publisher_key = 10000
warehouse_key = 100000
author_key_map = {}
init_author_key = 50000
isbns = set()
cart_ids = []


def get_publisher_key(publisher: str) -> int:
    # gets the publisher key of an publisher string, function creates a new key if it doesn't exist
    global init_publisher_key
    if publisher in publisher_key_map:
        return publisher_key_map[publisher]
    else:
        publisher_key_map[publisher] = init_publisher_key
        init_publisher_key += 1
        return publisher_key_map[publisher]


def get_author_key(author: str) -> int:
    # gets the author key of a author string, function creates a new key if it doesn't exist
    global init_author_key
    if author in author_key_map:
        return author_key_map[author]
    else:
        author_key_map[author] = init_author_key
        init_author_key += 1
        return author_key_map[author]


bookTitles = []

# First, from each page of the goodreads website, get a list of all the books mentioned in said title
# to do this, we webscrape the website and grab only the book titles
for page in range(1, 2):
    bookUrl = get_book_url(page)
    req = requests.get(bookUrl)
    soup = BeautifulSoup(req.content, "html.parser")
    for a in soup.find_all('a', class_='bookTitle'):
        bookTitles.append(a.text.strip())

print(len(bookTitles))

# ddl statements such that they are algined in the file output
book_ddl = []
written_by_ddl = []
author_ddl = []
publisher_ddl = []
inst_phone_ddl = []
cart_ddl = []
contain_ddl = []
user_ddl = ""
shipping_ddl = []
order_ddl = []
k = 0

for book in bookTitles:
    # Use google book api to get data per a book
    res = requests.get(
        f'https://www.googleapis.com/books/v1/volumes?q={urllib.parse.quote(book)}&maxResults=1&printType=books'
        f'&filter=ebooks')
    data = json.loads(res.text)
    if len(data['items']) != 1:
        continue

    # Types of book data the api provides
    json_data = data['items'][0]
    json_book = json_data['volumeInfo']
    json_sales = json_data['saleInfo']

    # Extract book related data
    isbn = ''
    for identifier in json_book['industryIdentifiers']:
        if identifier['type'] == 'ISBN_13' or identifier['type'] == 'ISBN_10':
            isbn = identifier['identifier']
            break
    if isbn == '' or isbn in isbns:
        isbn = random.randint(1000000000, 9999999999)
    isbns.add(isbn)

    title = book.replace('\'',"\'\'").replace('(' , '- ').replace(')', '')

    if '-' in json_book['publishedDate']:
        year = json_book['publishedDate'][:json_book['publishedDate'].find('-')]
    else:
        year = json_book['publishedDate']

    genre = json_book['categories'][0]
    if 'pageCount' not in json_book: #bad book
        continue
    page_count = json_book['pageCount']
    publisher = json_book['publisher'].replace('\'', '')
    url = json_book['imageLinks']['thumbnail']

    quantity = random.randint(10, 50)

    # Extract sales related data
    price = json_sales['listPrice']['amount']
    commission = clamp((price - json_sales['retailPrice']['amount']) / 50, 0.01, 0.5)

    # Create the ddl statements
    book_ddl.append(f"INSERT INTO book VALUES(\'{isbn}\', \'{title}\', {year}, \'{genre}\', {page_count}, {price}, {commission},"
                    f" \'{url}\', {quantity}, {warehouse_key}, {get_publisher_key(publisher)}, true);\n")

    for author in json_book['authors']:
        author_id = get_author_key(author)

        written_by_ddl.append(f"INSERT INTO written_by VALUES(\'{isbn}\', {author_id});\n")

    # (for now), this makes the creation of ddls stop after ~20 books
    if k == 100:
        break
    k += 1

# Iterate over the author key map to populate the author table with it's key and name
for author_key_pair in author_key_map.items():
    author_id = author_key_pair[1]
    name = author_key_pair[0]

    author_ddl.append(f"INSERT INTO author VALUES({author_id}, \'{name}\');\n")

# Iterate over the publisher key map to populate the publisher table
# We create random addresses, emails from lists already predefinied
for publisher_key_pair in publisher_key_map.items():
    publisher_id = publisher_key_pair[1]
    name = publisher_key_pair[0]
    address = random.choice(fake_addresses).replace(',', '')
    email_ext = address.split(' ')[0]
    if ',' in address:
        email_ext = address[:address.find(',')]
    email = f"{name.replace(' ', '')}.{email_ext}{random.choice(fake_emails)}"
    bank_number = random.randint(10000000, 99999999)
    phone_number = f"{random.randint(100, 999)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}"

    publisher_ddl.append(f"INSERT INTO publisher VALUES({publisher_id}, \'{name}\', \'{address}\', \'{email}\', \'{bank_number}\');\n")
    inst_phone_ddl.append(f"INSERT INTO inst_phone VALUES({publisher_id}, \'{phone_number}\');\n")

#date
today = datetime.datetime.today()
date_list = [today - datetime.timedelta(days = x+1)for x in range(60)] #range (1) days = 1 days ago

#create cart, create contain, insert to ddl defult 1-10
cart_end = 31
for cart_ID in range(1,cart_end):       #cart_ID is 1-9 apply as the numbers on function keys, applied in contain_ddl, shipping_ddl and order_ddl
    cart_ddl.append(f"INSERT INTO cart VALUES({cart_ID});\n")
    cart_ids.append(cart_ID)
    for i in random.sample(isbns,random.randrange(1,6)):
        contain_ddl.append (f"INSERT INTO contains VALUES(\'{i}\',{cart_ID},{random.randrange(1, 5)});\n")
    shipping_ddl.append(f"INSERT INTO shipping VALUES({cart_ID}, \'{random.choice(fake_company_name)}\',\'{random.choice(fake_status)}\',{warehouse_key});\n")
    order_ddl.append(f"INSERT INTO orders VALUES({cart_ID}, \'{random.choice(date_list)}\', \'{random.choice(fake_addresses)}\',\'{random.randint(10000000, 99999999)}\', {cart_ID},{random.randrange(1,6)},{cart_ID});\n")
for cart_ID in range(cart_end,cart_end+5):# empty carts for 5 fake users
    cart_ddl.append(f"INSERT INTO cart VALUES({cart_ID});\n")
#create users manually 
user_ddl = (f"INSERT INTO users VALUES(1, {cart_end}, 'esulu', 'pass', 'Eren Sulutas', 'eren@email.com', '123 Alexandria Way', false);\n"
            f"INSERT INTO users VALUES(2, {cart_end+1}, 'ben', '1234', 'ishappy', 'ben@email.com', '456 Admin Road', false);\n"
            f"INSERT INTO users VALUES(3, {cart_end+2}, 'josh', '1234', 'cl', 'josh@email.com', '763 Glendale Ave', false);\n"
            f"INSERT INTO users VALUES(4, {cart_end+3}, 'admin', 'admin', 'admin', 'admin@email.com', '456 Admin Road', true);\n"
            f"INSERT INTO users VALUES(5, {cart_end+4}, 'bbbb', '1234', 'BBB', 'BBB@email.com', '868 Poor House Street', false);\n"
            )
#create shipping_id 1-9, idk warehouse_ID 
#for shipping_ID in range (1,10):
    

#create orders_id 1-9 order_date is 2 month ago, 

#for order_ID in range (1,10):
    



# Output all ddls to the file
fopen.write(f"INSERT INTO warehouse VALUES({warehouse_key}, \'457 East Ave. Northbrook IL 60062\');\n")
for ddl in publisher_ddl:
    fopen.write(ddl)
for ddl in inst_phone_ddl:
    fopen.write(ddl)
for ddl in author_ddl:
    fopen.write(ddl)
for ddl in book_ddl:
    fopen.write(ddl)
for ddl in written_by_ddl:
    fopen.write(ddl)
for ddl in cart_ddl:
    fopen.write(ddl)
for ddl in contain_ddl:
    fopen.write(ddl)
for ddl in user_ddl:
    fopen.write(ddl)
for ddl in shipping_ddl:
    fopen.write(ddl)
for ddl in order_ddl:
    fopen.write(ddl)
fopen.close()
