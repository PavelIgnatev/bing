import { MongoClient, Db, Collection } from "mongodb";

const dbName: string = "telegram";
const collectionName: string = "bing";
const uri: string =
  "mongodb://qwerty:qwerty123@ac-llvczxo-shard-00-00.2ry9k50.mongodb.net:27017,ac-llvczxo-shard-00-01.2ry9k50.mongodb.net:27017,ac-llvczxo-shard-00-02.2ry9k50.mongodb.net:27017/?ssl=true&replicaSet=atlas-b2xf0l-shard-0&authSource=admin&retryWrites=true&w=majority";

interface Account {
  _id: string;
  cookie: string;
}

class AccountService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private collection: Collection<Account> | null = null;

  constructor() {
    this.connect = this.connect.bind(this);
    this.readAccounts = this.readAccounts.bind(this);
    this.readAccount = this.readAccount.bind(this);
    this.insertAccount = this.insertAccount.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
  }

  async connect(): Promise<void> {
    if (this.client) {
      return;
    }

    this.client = await MongoClient.connect(uri);
    this.db = this.client.db(dbName);
    this.collection = this.db.collection(collectionName);
  }

  async readAccounts(): Promise<Account[] | null> {
    await this.connect();

    if (!this.collection) {
      return null;
    }

    return await this.collection.find().toArray();
  }

  async readAccount(): Promise<Account | null> {
    const accounts = await this.readAccounts();
    if (!accounts || accounts.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * accounts.length);

    return accounts[randomIndex];
  }

  async insertAccount(account: { cookie: string }): Promise<void> {
    await this.connect();

    if (!this.collection) {
      return;
    }

    const existingAccount = await this.collection.findOne({ cookie: account.cookie });

    if (!existingAccount) {
      await this.collection.insertOne(account as Account);
    } else {
      console.log('Аккаунт с таким cookie уже есть в системе');
    }
  }

  async deleteAccount(id: string): Promise<void> {
    await this.connect();

    if (!this.collection) {
      return;
    }

    await this.collection.deleteOne({ _id: id });
  }
}

export default new AccountService();
