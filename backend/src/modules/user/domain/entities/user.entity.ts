export class User {
  constructor(
    private name: string,
    private email: string,
    private password: string,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
    private id?: string,
  ) { }

  getId(): string { return this.id || ''; }
  getName(): string { return this.name; }
  getEmail(): string { return this.email; }
  getPassword(): string { return this.password; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }

  updateEmail(email: string): void {
    this.email = email;
    this.updatedAt = new Date();
  }

  updatePassword(password: string): void {
    this.password = password;
    this.updatedAt = new Date();
  }

  static create(name: string, email: string, password: string): User {
    return new User(
      name,
      email,
      password
    );
  }

  static reconstitute(
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(name, email, password, createdAt, updatedAt, id);
  }
} 