class PrintEditionItem {
  constructor(name, releaseDate, pagesCount) {
    this.name = name;
    this.releaseDate = releaseDate;
    this.pagesCount = pagesCount;
    this._state = 100;
    this.type = null;
  }

  set state(value) {
    if (value < 0) {
      this._state = 0;
    } else if (value > 100) {
      this._state = 100;
    } else {
      this._state = value;
    }
  }

  get state() {
    return this._state;
  }

  fix() {
    this.state = this.state * 1.5;
  }
}

class Magazine extends PrintEditionItem {
  constructor(name, releaseDate, pagesCount) {
    super(name, releaseDate, pagesCount);
    this.type = 'magazine';
  }
}

class Book extends PrintEditionItem {
  constructor(author, name, releaseDate, pagesCount) {
    super(name, releaseDate, pagesCount);
    this.author = author;
    this.type = 'book';
  }
}

class NovelBook extends Book {
  constructor(author, name, releaseDate, pagesCount) {
    super(author, name, releaseDate, pagesCount);
    this.type = 'novel';
  }
}

class FantasticBook extends Book {
  constructor(author, name, releaseDate, pagesCount) {
    super(author, name, releaseDate, pagesCount);
    this.type = 'fantastic';
  }
}

class DetectiveBook extends Book {
  constructor(author, name, releaseDate, pagesCount) {
    super(author, name, releaseDate, pagesCount);
    this.type = 'detective';
  }
}

class Library {
  constructor(name) {
    this.name = name;
    this.books = [];
  }

  addBook(book) {
    if (book.state > 30) {
      this.books.push(book);
    }
  }

  findBookBy(type, value) {
    return this.books.find((book) => book[type] === value) || null;
  }

  giveBookByName(bookName) {
    const bookIndex = this.books.findIndex((book) => book.name === bookName);

    if (bookIndex === -1) {
      return null;
    }

    const [book] = this.books.splice(bookIndex, 1);
    return book;
  }
}

class Student {
  constructor(name) {
    this.name = name;
    this.marks = {};
  }

  addMark(mark, subject) {
    if (typeof mark !== 'number' || !Number.isFinite(mark) || mark < 2 || mark > 5) {
      return;
    }

    if (!this.marks[subject]) {
      this.marks[subject] = [];
    }

    this.marks[subject].push(mark);
  }

  getAverageBySubject(subject) {
    if (!this.marks[subject] || this.marks[subject].length === 0) {
      return 0;
    }

    const markSum = this.marks[subject].reduce((sum, mark) => sum + mark, 0);
    return markSum / this.marks[subject].length;
  }

  getAverage() {
    const subjects = Object.keys(this.marks);

    if (subjects.length === 0) {
      return 0;
    }

    const averageSum = subjects.reduce((sum, subject) => {
      return sum + this.getAverageBySubject(subject);
    }, 0);

    return averageSum / subjects.length;
  }
}

function runLibraryTest() {
  const library = new Library('Библиотека имени Ленина');

  library.addBook(
    new DetectiveBook(
      'Артур Конан Дойл',
      'Полное собрание повестей и рассказов о Шерлоке Холмсе в одном томе',
      2019,
      1008
    )
  );

  library.addBook(
    new FantasticBook(
      'Аркадий и Борис Стругацкие',
      'Пикник на обочине',
      1972,
      168
    )
  );

  library.addBook(new NovelBook('Герберт Уэллс', 'Машина времени', 1895, 138));
  library.addBook(new Magazine('Мурзилка', 1924, 60));

  let bookFrom1919 = library.findBookBy('releaseDate', 1919);

  if (bookFrom1919 === null) {
    bookFrom1919 = new NovelBook('Герберт Уэллс', 'Первые люди на Луне', 1919, 300);
    library.addBook(bookFrom1919);
  }

  console.log(library.findBookBy('name', 'Властелин колец'));
  console.log(library.findBookBy('releaseDate', 1919).name);
  console.log('Количество книг до выдачи: ' + library.books.length);

  const issuedBook = library.giveBookByName('Пикник на обочине');

  console.log('Количество книг после выдачи: ' + library.books.length);

  if (issuedBook !== null) {
    issuedBook.state = 40;
    issuedBook.fix();
    library.addBook(issuedBook);

    console.log('Состояние возвращённой книги: ' + issuedBook.state);
    console.log('Количество книг после возврата: ' + library.books.length);
  }
}

function runStudentTest() {
  const student = new Student('Олег Никифоров');

  student.addMark(5, 'химия');
  student.addMark(5, 'химия');
  student.addMark(5, 'физика');
  student.addMark(4, 'физика');
  student.addMark(6, 'физика');

  console.log('Средний балл по физике: ' + student.getAverageBySubject('физика'));
  console.log('Средний балл по биологии: ' + student.getAverageBySubject('биология'));
  console.log('Средний балл по всем предметам: ' + student.getAverage());
}

runLibraryTest();
runStudentTest();
