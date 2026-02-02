# Calculadora de IRA - UFC

Uma aplicação web moderna e interativa para calcular o **Índice de Rendimento Acadêmico (IRA)** a partir do histórico escolar em PDF da **Universidade Federal do Ceará (UFC)**. Além do cálculo, a ferramenta oferece uma análise detalhada do desempenho acadêmico e permite simular notas futuras.

![Demonstração da Calculadora de IRA](/public/preview.png)

## ✨ Funcionalidades

- **Upload de Histórico**: Carregue seu histórico escolar em formato PDF para análise automática.
- **Dashboard Analítico**: Visualize de forma clara e organizada todas as suas métricas acadêmicas.
- **Cálculo de IRA**:
  - **IRA Individual**: Seu índice calculado com base nas suas notas, carga horária e um fator de penalidade por trancamentos.
  - **IRA Geral**: Seu índice normalizado em relação à média e desvio padrão do seu curso.
- **Análise de Desempenho**:
  - Gráficos da evolução do seu IRA e da sua média por semestre.
  - Distribuição de notas por faixa (Ruim, Regular, Bom, Ótimo, Excelente).
  - Análise da carga horária cursada por semestre.
- **Progresso do Curso**: Acompanhe o percentual de conclusão do seu curso com base nos créditos obrigatórios.
- **Disciplinas Pendentes**: Visualize uma lista das disciplinas obrigatórias que ainda não foram cursadas.
- **Simulação de Notas**: Adicione disciplinas futuras e simule notas para prever qual será seu IRA ao final do semestre.

## 🚀 Como Executar

Para executar o projeto localmente, siga os passos abaixo:

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/kelvinleandro/react-ufc-ira-calculator.git
   cd react-ufc-ira-calculator
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

4. **Abra no navegador:**
   Acesse [http://localhost:5173](http://localhost:5173) (ou a porta indicada no seu terminal) para visualizar a aplicação.
