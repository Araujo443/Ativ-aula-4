// ENUMS
enum StatusLivro {
  DISPONIVEL,
  EMPRESTADO
}

enum TipoUsuario {
  ALUNO,
  PROFESSOR,
  FUNCIONARIO
}

// CLASSES DE MODELO
class Livro {
  constructor(
    public titulo: string,
    public autor: string,
    public isbn: string,
    public status: StatusLivro = StatusLivro.DISPONIVEL
  ) {}
}

class Usuario {
  public livrosEmprestados: number = 0;

  constructor(
    public nome: string,
    public email: string,
    public tipo: TipoUsuario
  ) {}

  getLimite(): number {
    switch (this.tipo) {
      case TipoUsuario.PROFESSOR: return 10;
      case TipoUsuario.FUNCIONARIO: return 5;
      default: return 3;
    }
  }
}

class Emprestimo {
  constructor(
    public isbn: string,
    public emailUsuario: string,
    public dataEmprestimo: Date,
    public dataDevolucao: Date,
    public ativo: boolean = true
  ) {}

  calcularMulta(): number {
    const dias = Math.floor(
      (Date.now() - this.dataDevolucao.getTime()) / (1000 * 60 * 60 * 24)
    );
    return dias > 0 ? dias * 2.5 : 0;
  }
}

// CLASSE PRINCIPAL
class SistemaBiblioteca {
  private livros: Livro[] = [];
  private usuarios: Usuario[] = [];
  private emprestimos: Emprestimo[] = [];

  adicionarLivro(livro: Livro) {
    this.livros.push(livro);
  }

  cadastrarUsuario(usuario: Usuario) {
    this.usuarios.push(usuario);
  }

  realizarEmprestimo(isbn: string, email: string) {
    const livro = this.buscarLivro(isbn);
    const usuario = this.buscarUsuario(email);

    if (!livro) return console.log("Livro não encontrado");
    if (!usuario) return console.log("Usuário não encontrado");
    if (livro.status !== StatusLivro.DISPONIVEL) return console.log("Indisponível");

    if (usuario.livrosEmprestados >= usuario.getLimite()) {
      return console.log("Limite atingido");
    }

    livro.status = StatusLivro.EMPRESTADO;
    usuario.livrosEmprestados++;

    const hoje = new Date();
    const devolucao = new Date();
    devolucao.setDate(hoje.getDate() + 14);

    this.emprestimos.push(
      new Emprestimo(isbn, email, hoje, devolucao)
    );
  }

  private buscarLivro(isbn: string): Livro | undefined {
    return this.livros.find(l => l.isbn === isbn);
  }

  private buscarUsuario(email: string): Usuario | undefined {
    return this.usuarios.find(u => u.email === email);
  }
}
