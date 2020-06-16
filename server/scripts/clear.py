from pymongo import MongoClient

response = input('Type \'Confirm\' to clear the db: ')
if response.lower() == 'confirm':
    client = MongoClient(port=27017)
    db = client.memegle
    pic_col = db.pictures
    seq_col = db.database_sequences

    pic_col.drop()
    seq_col.drop()

    print('Cleared')
else:
    print('Cancelled')