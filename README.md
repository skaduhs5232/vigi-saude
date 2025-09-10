# VigiSaúde - Sistema de Vigilância Sanitária Hospitalar

Sistema web para gestão de notificações de vigilância sanitária em hospitais, focado na melhoria da qualidade e segurança assistencial.

## 📋 Sobre o Projeto

O VigiSaúde é uma plataforma desenvolvida para facilitar o registro, acompanhamento e análise de notificações de vigilância sanitária em ambiente hospitalar. O sistema permite o gerenciamento de diferentes tipos de eventos relacionados à segurança do paciente.

### Modalidades de Vigilância

- **Farmacovigilância** - Monitoramento de reações adversas a medicamentos
- **Tecnovigilância** - Controle de eventos relacionados a equipamentos médicos
- **Hemovigilância** - Vigilância de eventos transfusionais
- **Processo de Cuidado** - Monitoramento de eventos assistenciais
- **Outros** - Biovigilância, cosmetovigilância e vigilância de saneantes

## 🚀 Funcionalidades

- ✅ Dashboard administrativo com métricas e gráficos
- ✅ Interface simplificada para usuários operacionais
- ✅ Sistema de notificações por módulo
- ✅ Filtros avançados de pesquisa
- ✅ Exportação de dados para Excel
- ✅ Formulários estruturados para cada tipo de vigilância
- ✅ Identificação e cadastro de notificadores

## 🛠️ Tecnologias Utilizadas

### Backend
- **ASP.NET Core 8** - Framework web
- **Entity Framework Core** - ORM para acesso a dados
- **MySQL** - Banco de dados
- **ASP.NET Identity** - Sistema de autenticação

### Frontend
- **React 18** - Biblioteca para interface de usuário
- **TypeScript** - Linguagem de programação
- **Tailwind CSS** - Framework de estilização
- **Vite** - Build tool e servidor de desenvolvimento
- **Shadcn/ui** - Biblioteca de componentes
- **React Hook Form** - Gerenciamento de formulários
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- .NET 8 SDK
- MySQL 8.0+

### Configuração do Backend

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd VigiSaude.Backend
```

2. Configure a string de conexão no `appsettings.json`
```json
{
  "ConnectionStrings": {
    "VigiSaude": "Server=localhost;Database=vigisaude;Uid=usuario;Pwd=senha;"
  }
}
```

3. Execute as migrações do banco de dados
```bash
dotnet ef database update
```

4. Execute o projeto
```bash
dotnet run
```

### Configuração do Frontend

1. Navegue para a pasta do frontend
```bash
cd VigiSaude.Frontend
```

2. Instale as dependências
```bash
npm install
```

3. Execute o projeto em modo desenvolvimento
```bash
npm run dev
```

4. Acesse o sistema em `http://localhost:8080`

## 🏗️ Estrutura do Projeto

```
VigiSaude/
├── VigiSaude.Backend/          # API Backend
│   ├── Controllers/            # Controladores da API
│   ├── Data/                   # Contextos do banco de dados
│   ├── Models/                 # Modelos de dados
│   ├── Repositories/           # Repositórios e Unit of Work
│   └── Configurations/         # Configurações da aplicação
└── VigiSaude.Frontend/         # Interface Frontend
    ├── src/
    │   ├── components/         # Componentes React
    │   ├── pages/             # Páginas da aplicação
    │   ├── hooks/             # Hooks customizados
    │   └── lib/               # Utilitários
    └── public/                # Arquivos estáticos
```

## 🎯 Objetivos do Projeto

### Objetivo Geral
Desenvolver uma plataforma de gestão de riscos para hospitais

### Objetivos Específicos
- Possibilitar a notificação de incidentes nos hospitais
- Gerar relatórios para gerência de risco
- Automatizar processos hospitalares

### Resultados Esperados
- Melhoria na qualidade de trabalho dos profissionais dos hospitais
- Redução de eventos adversos evitáveis
- Fortalecimento da cultura de segurança nas instituições de saúde

## 🔧 Scripts Disponíveis

### Frontend
- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção
- `npm run lint` - Executa linter

### Backend
- `dotnet run` - Executa a aplicação
- `dotnet ef migrations add <nome>` - Cria nova migração
- `dotnet ef database update` - Aplica migrações no banco

## 📊 Funcionalidades por Perfil

### Administrador
- Dashboard com métricas e análises
- Visão geral de todos os módulos
- Relatórios e indicadores de performance
- Gestão completa do sistema

### Usuário Padrão
- Interface focada em ações rápidas
- Cadastro de notificações
- Visualização de notificações recentes
- Acesso aos módulos de vigilância
