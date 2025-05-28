export class Contact {
   'id': number;
   'name': string;
   'content': string;
   'date': Date;
   'title': string;
   'email': string;
   'trash': number;
   'status': number;
   constructor(id: number, name: string,content: string, title: string, email: string,date: Date, trash: number, status: number) {
      this.id=id;
      this.name=name;
      this.content=content;
      this.title=title;
      this.email=email;
      this.status=status;
      this.trash=trash;
      this.date=date;
  }
}
