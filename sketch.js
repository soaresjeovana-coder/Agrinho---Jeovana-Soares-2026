let tela = "menu"; 
let velocidadeVento = 5; // m/s inicial

// Elementos do Ambiente e Parque
let particulasVento = [];
let nuvens = [];
let parqueEolico = [];
let droneEquipe;

// Estado e Estilização do Quiz
let perguntaAtual = 0;
let respostaSelecionada = -1;
let feedback = "";
let corFeedback;
let pontuacao = 0;
let alphaTransicao = 0; // Para efeito de fade-in nas telas

const perguntas = [
  {
    q: "1. Qual é a principal fonte primária responsável por gerar os ventos na Terra?",
    opcoes: ["A) O calor e radiação do Sol", "B) O campo geomagnético terrestre", "C) O movimento das marés oceânicas", "D) A força gravitacional da Lua"],
    correta: 0,
    curiosidade: "O Sol aquece a atmosfera de forma desigual. O ar quente (mais leve) sobe e o ar frio ocupa seu lugar, gerando os ventos."
  },
  {
    q: "2. Qual componente do aerogerador é responsável por converter a energia mecânica das pás em energia elétrica?",
    opcoes: ["A) O Anemômetro", "B) O Gerador Elétrico", "C) O Inversor de Frequência", "D) O Sistema de Giro (Yaw)"],
    correta: 1,
    curiosidade: "O movimento de rotação gira um eixo conectado ao gerador eletromagnético, transformando força mecânica em eletricidade."
  },
  {
    q: "3. Por que os complexos eólicos 'offshore' (em alto-mar) são altamente eficientes?",
    opcoes: ["A) A água salgada conduz eletricidade", "B) Não há incidência de raios UV no mar", "C) Os ventos marítimos são mais fortes, constantes e sem barreiras físicas", "D) A manutenção é mais barata"],
    correta: 2,
    curiosidade: "Sem montanhas ou prédio para barrar o vento, as rajadas no oceano são muito mais limpas, retas e potentes."
  },
  {
    q: "4. O que acontece com um aerogerador real se o vento atingir velocidades extremas (ex: tempestades de 90 km/h)?",
    opcoes: ["A) Ele gira infinitamente até queimar", "B) O sistema ativa os freios aerodinâmicos e para por segurança (Cut-out)", "C) Ele inverte o sentido de rotação", "D) A energia gerada dobra de valor"],
    correta: 1,
    curiosidade: "Chama-se velocidade de 'Cut-out'. Para não destruir a estrutura física, as pás mudam de ângulo (pitch) e param totalmente."
  },
  {
    q: "5. Em termos de matriz elétrica, a energia eólica é classificada como uma fonte:",
    opcoes: ["A) Fóssil e finita", "B) Renovável, limpa e de baixa emissão de gases estufa", "C) Poluente de transição", "D) Secundária não controlável"],
    correta: 1,
    curiosidade: "Além de inesgotável, a energia eólica mitiga toneladas de CO2 que seriam emitidos por usinas termelétricas."
  }
];

// --- CLASSES (POO) ---

class Aerogerador {
  constructor(x, y, h, variacaoVel) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.angulo = random(TWO_PI);
    this.multiplicadorVel = variacaoVel;
  }

  atualizar(velVento) {
    this.angulo += (velVento * 0.015) * this.multiplicadorVel;
  }

  desenhar() {
    push();
    translate(this.x, this.y);
    
    // Sombra projetada
    fill(15, 23, 42, 25);
    noStroke();
    ellipse(0, 0, this.h * 0.3, 8);
    
    // Torre Cônica Industrial Gradiente
    stroke(218, 226, 233);
    strokeWeight(this.h * 0.065); 
    line(-1, 0, -0.5, -this.h); 
    stroke(241, 245, 249);
    strokeWeight(this.h * 0.045); 
    line(0.5, 0, 0, -this.h);
    
    // Nacela (Cabine Superior)
    translate(0, -this.h);
    fill(203, 213, 225);
    noStroke();
    rect(-14, -10, 30, 20, 4);
    fill(148, 163, 184);
    rect(10, -6, 12, 12, 2); 
    
    // Rotor Frontal
    rotate(this.angulo);
    fill(100, 116, 139);
    ellipse(0, 0, 14, 14);
    
    // Três Pás Aerodinâmicas
    for (let i = 0; i < 3; i++) {
      rotate(TWO_PI / 3);
      fill(255);
      beginShape();
      vertex(-2, 0);
      vertex(-4, -this.h * 0.35); 
      vertex(-1, -this.h * 0.85); 
      vertex(1, -this.h * 0.85);
      vertex(4, -this.h * 0.35);
      vertex(2, 0);
      endShape(CLOSE);
      
      stroke(226, 232, 240);
      strokeWeight(1);
      line(0, 0, 0, -this.h * 0.8);
      noStroke();
    }
    
    fill(241, 245, 249);
    ellipse(0, 0, 8, 8);
    pop();
  }
}

class DroneInspecao {
  constructor() {
    this.x = -100;
    this.y = 150;
    this.targetY = 150;
  }

  atualizar() {
    this.x += 1.8;
    if (this.x > width + 100) {
      this.x = -100;
    }
    // Flutuação harmônica simulando vento na aeronave
    this.y = this.targetY + sin(frameCount * 0.05) * 15;
  }

  desenhar() {
    // Scanner Laser Ativo (Efeito Cone Conectado)
    noStroke();
    let laserColor = color(6, 182, 212, 30);
    fill(laserColor);
    triangle(this.x, this.y + 6, this.x - 50, 410, this.x + 50, 410);
    
    stroke(6, 182, 212, 180);
    strokeWeight(1.5);
    line(this.x - 25, this.y + 100 + sin(frameCount * 0.1) * 10, this.x + 25, this.y + 100 + sin(frameCount * 0.1) * 10);

    // Estrutura Física do Drone
    push();
    translate(this.x, this.y);
    noStroke();
    
    // Chassi Core
    fill(30, 41, 59);
    rect(-25, -6, 50, 12, 6);
    fill(6, 182, 212); // Sensor Óptico Ciano
    ellipse(0, 4, 8, 8);
    
    // Braços dos Motores
    stroke(71, 85, 105);
    strokeWeight(3.5);
    line(-25, 0, -36, -5);
    line(25, 0, 36, -5);
    
    // Hélices em alta rotação
    noStroke();
    fill(148, 163, 184, 180);
    ellipse(-36, -6, 24 + sin(frameCount * 0.7) * 10, 3);
    ellipse(36, -6, 24 + cos(frameCount * 0.7) * 10, 3);
    
    // Telemetria Beacon LED (Pisca)
    if (frameCount % 30 < 15) {
      fill(239, 68, 68);
      ellipse(-15, -4, 5, 5);
    } else {
      fill(34, 197, 94);
      ellipse(15, -4, 5, 5);
    }
    pop();
  }
}

// --- SETUP & DRAW ---

function setup() {
  createCanvas(700, 550);
  
  // Instancia o Parque Eólico de forma procedural (X, Y, Altura, Multiplicador de Rotação)
  parqueEolico.push(new Aerogerador(160, 415, 120, 1.05)); // Fundo Esquerda
  parqueEolico.push(new Aerogerador(540, 415, 135, 0.92)); // Fundo Direita
  parqueEolico.push(new Aerogerador(350, 425, 175, 1.00)); // Primeiro Plano Centro
  
  droneEquipe = new DroneInspecao();

  for (let i = 0; i < 25; i++) {
    particulasVento.push({ x: random(width), y: random(40, 360), w: random(30, 70), h: random(1, 2.5) });
  }
  for (let i = 0; i < 4; i++) {
    nuvens.push({ x: random(width), y: random(30, 150), escala: random(0.6, 1.2), vel: random(0.1, 0.4) });
  }
}

function draw() {
  setGradient(0, 0, width, height, color(234, 244, 252), color(209, 227, 243));
  
  if (tela === "menu") desenharMenu();
  else if (tela === "simulacao") desenharSimulacao();
  else if (tela === "quiz") desenharQuiz();
  else if (tela === "resultado") desenharResultado();
}

// --- AMBIENTE ---

function atualizarAmbiente() {
  fill(255, 255, 255, 170);
  noStroke();
  for (let n of nuvens) {
    n.x += n.vel * (velocidadeVento * 0.4 + 0.2);
    if (n.x > width + 100) n.x = -100;
    push();
    translate(n.x, n.y);
    scale(n.escala);
    ellipse(0, 0, 60, 40);
    ellipse(20, -10, 50, 40);
    ellipse(-20, -5, 40, 35);
    pop();
  }

  stroke(255, 255, 255, 150);
  for (let p of particulasVento) {
    strokeWeight(p.h);
    line(p.x, p.y, p.x + p.w, p.y);
    p.x += velocidadeVento * 1.9 + 0.6;
    if (p.x > width) {
      p.x = -p.w;
      p.y = random(40, 360);
    }
  }
}

// --- COMPONENTES DE INTERFACE (UI) ---

function desenharMenu() {
  fill(255, 255, 255, 230);
  rect(100, 60, 500, 430, 20);
  
  textAlign(CENTER, CENTER);
  noStroke();
  fill(15, 23, 42);
  textSize(34);
  textStyle(BOLD);
  text("EOLO-TECH LABS", width / 2, 125);
  
  textSize(14);
  textStyle(NORMAL);
  fill(100, 116, 139);
  text("Simulador de Engenharia Eólica Avançada", width / 2, 165);
  
  stroke(241, 245, 249);
  strokeWeight(2);
  line(160, 205, 540, 205);
  
  let hSim = checarHover(width / 2 - 140, 245, 280, 52);
  desenharBotaoArredondado(width / 2 - 140, 245, 280, 52, "Acessar Simulador Complexo", hSim ? color(14, 165, 233) : color(2, 132, 199));
  
  let hQuiz = checarHover(width / 2 - 140, 325, 280, 52);
  desenharBotaoArredondado(width / 2 - 140, 325, 280, 52, "Iniciar Certificação Técnica", hQuiz ? color(34, 197, 94) : color(22, 163, 74));
  
  noStroke();
  fill(148, 163, 184);
  textSize(11);
  text("Centro Operacional Eólico de Engenharia Sustentável • 2026", width / 2, 455);
}

function desenharSimulacao() {
  atualizarAmbiente();
  
  // Renderização do Solo
  fill(51, 163, 102);
  noStroke();
  rect(0, 410, width, height - 410);
  fill(40, 145, 89);
  rect(0, 435, width, height - 435);
  
  // Atualização das Estruturas via laço OOP
  for (let turbina of parqueEolico) {
    turbina.atualizar(velocidadeVento);
    turbina.desenhar();
  }
  
  // Movimentação do Drone de Varredura
  droneEquipe.atualizar();
  droneEquipe.desenhar();
  
  // Painel de Telemetria Integrado
  let velCalculo = min(velocidadeVento, 12);
  let potenciaIndividual = velocidadeVento === 0 ? 0 : (1.45 * Math.pow(velCalculo, 3));
  let potenciaTotalComplexo = potenciaIndividual * parqueEolico.length;
  let residenciasAlimentadas = Math.floor(potenciaTotalComplexo / 1.3);
  let co2Poupado = (potenciaTotalComplexo * 0.00042).toFixed(3);

  fill(15, 23, 42, 245);
  rect(25, 25, 290, 185, 14);
  stroke(51, 65, 85);
  strokeWeight(1);
  noFill();
  rect(25, 25, 290, 185, 14);
  
  noStroke();
  textAlign(LEFT, TOP);
  fill(14, 165, 233);
  textStyle(BOLD);
  textSize(12);
  text("TELEMETRIA COMPLETA DO PARQUE", 42, 42);
  
  fill(255);
  textSize(13);
  textStyle(NORMAL);
  text("Módulos Ativos:", 42, 72);
  textStyle(BOLD); text(`${parqueEolico.length} Turbinas`, 195, 72);
  
  textStyle(NORMAL); text("Velocidade do Vento:", 42, 97);
  textStyle(BOLD); text(`${velocidadeVento} m/s`, 195, 97);
  
  textStyle(NORMAL); text("Capacidade do Grid:", 42, 122);
  textStyle(BOLD); fill(250, 204, 21); text(`${potenciaTotalComplexo.toFixed(1)} kW`, 195, 122);
  
  fill(255);
  textStyle(NORMAL); text("Retenção de CO2/h:", 42, 147);
  textStyle(BOLD); fill(74, 222, 128); text(`${co2Poupado} kg`, 195, 147);

  // Card do Teclado Interativo
  fill(255, 255, 255, 210);
  noStroke();
  rect(25, 220, 290, 48, 8);
  fill(51, 65, 85);
  textSize(11);
  textStyle(NORMAL);
  text("Controle Dinâmico de Clima:\n[▲ Seta Superior] Aumentar Vento  |  [▼ Seta Inferior] Reduzir", 36, 228);

  // Botão Retornar
  textAlign(CENTER, CENTER);
  let hVoltar = checarHover(width - 130, 25, 105, 38);
  desenharBotaoArredondado(width - 130, 25, 105, 38, "Fechar Painel", hVoltar ? color(100) : color(71, 85, 105));
}

function desenharQuiz() {
  // Controle suave de transição de tela (Fade-In)
  if (alphaTransicao < 255) alphaTransicao += 15;
  
  let p = perguntas[perguntaAtual];
  
  // Card Central do Quiz
  fill(255, 255, 255, alphaTransicao);
  noStroke();
  rect(45, 40, width - 90, 465, 16);
  
  // Track de Progresso Superior
  fill(241, 245, 249, alphaTransicao);
  rect(45, 40, width - 90, 8, [16, 16, 0, 0]);
  fill(14, 165, 233, alphaTransicao);
  let larguraPreenchida = ((perguntaAtual + 1) / perguntas.length) * (width - 90);
  rect(45, 40, larguraPreenchida, 8, [16, 0, 0, 0]);

  // Indicador de Questão Ativa
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  fill(14, 165, 233, alphaTransicao);
  text(`MÓDULO DE AVALIAÇÃO • QUESTÃO ${perguntaAtual + 1} / ${perguntas.length}`, 70, 70);
  
  // Título da Pergunta
  fill(15, 23, 42, alphaTransicao);
  textSize(16);
  textStyle(BOLD);
  text(p.q, 70, 95, width - 140, 60);
  
  // Renderização das Alternativas Técnicas
  textSize(13);
  textStyle(NORMAL);
  for (let i = 0; i < p.opcoes.length; i++) {
    let yPos = 165 + i * 54;
    let cBotao = color(248, 250, 252, alphaTransicao);
    let cTexto = color(71, 85, 105, alphaTransicao);
    let cBorda = color(226, 232, 240, alphaTransicao);
    
    let isOver = checarHover(70, yPos, width - 140, 42);
    
    if (respostaSelecionada === -1) {
      if (isOver) {
        cBotao = color(240, 249, 255, alphaTransicao);
        cTexto = color(2, 132, 199, alphaTransicao);
        cBorda = color(14, 165, 233, alphaTransicao);
      }
    } else {
      if (i === p.correta) {
        cBotao = color(240, 253, 244, alphaTransicao);
        cTexto = color(22, 163, 74, alphaTransicao);
        cBorda = color(74, 222, 128, alphaTransicao);
      } else if (respostaSelecionada === i) {
        cBotao = color(254, 242, 242, alphaTransicao);
        cTexto = color(220, 38, 38, alphaTransicao);
        cBorda = color(248, 113, 113, alphaTransicao);
      }
    }
    
    desenharBotaoQuizOpcao(70, yPos, width - 140, 42, p.opcoes[i], cBotao, cTexto, cBorda);
  }
  
  // Container de Feedback e Nota de Rodapé Técnico
  if (respostaSelecionada !== -1) {
    fill(corFeedback.levels[0], corFeedback.levels[1], corFeedback.levels[2], alphaTransicao);
    textStyle(BOLD);
    textSize(13);
    textAlign(CENTER, TOP);
    text(feedback, width / 2, 395);
    
    // Bloco da Nota Técnica Explicativa
    fill(248, 250, 252, alphaTransicao);
    stroke(226, 232, 240, alphaTransicao);
    strokeWeight(1);
    rect(70, 415, width - 140, 44, 8);
    
    noStroke();
    fill(100, 116, 139, alphaTransicao);
    textStyle(NORMAL);
    textSize(11);
    textAlign(LEFT, TOP);
    text(`ANÁLISE DE CAMPO: ${p.curiosidade}`, 80, 421, width - 160, 34);
    
    // Avançar Fluxo
    let labelBotao = perguntaAtual === perguntas.length - 1 ? "Concluir Relatório" : "Avançar Questão ❯";
    let hProx = checarHover(width - 215, 472, 145, 32);
    textAlign(CENTER, CENTER);
    desenharBotaoArredondado(width - 215, 472, 145, 32, labelBotao, hProx ? color(15, 23, 42) : color(71, 85, 105));
  }
  textAlign(CENTER, CENTER);
}

function desenharResultado() {
  fill(255, 255, 255);
  rect(120, 50, 460, 450, 16);
  
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(24);
  fill(15, 23, 42);
  text("Relatório Técnico Finalizado", width / 2, 105);
  
  fill(248, 250, 252);
  stroke(241, 245, 249);
  rect(230, 150, 240, 105, 14);
  
  noStroke();
  fill(100, 116, 139);
  textSize(12);
  textStyle(NORMAL);
  text("SCORE DE PRECISÃO", width / 2, 175);
  
  textSize(38);
  textStyle(BOLD);
  if (pontuacao >= 4) fill(34, 197, 94);
  else if (pontuacao === 3) fill(234, 179, 8);
  else fill(239, 68, 68);
  text(`${pontuacao} / ${perguntas.length}`, width / 2, 215);
  
  textSize(13);
  fill(71, 85, 105);
  textStyle(NORMAL);
  let diagnostico = "";
  if (pontuacao === 5) diagnostico = "Excelente! Alta proficiência técnica demonstrada. ⭐";
  else if (pontuacao >= 3) diagnostico = "Operação validada. Conhecimento estrutural estável. ⚡";
  else diagnostico = "Revisão recomendada nos processos operacionais da planta. 📚";
  text(diagnostico, width / 2, 295);
  
  let hRep = checarHover(width / 2 - 140, 355, 280, 46);
  desenharBotaoArredondado(width / 2 - 140, 355, 280, 46, "Refazer Teste de Engenharia", hRep ? color(100) : color(148, 163, 184));
  
  let hSim = checarHover(width / 2 - 140, 415, 280, 46);
  desenharBotaoArredondado(width / 2 - 140, 415, 280, 46, "Voltar ao Monitoramento", hSim ? color(14, 165, 233) : color(2, 132, 199));
}

function desenharBotaoArredondado(x, y, w, h, txt, cor) {
  fill(cor);
  noStroke();
  rect(x, y, w, h, 8);
  fill(255);
  textSize(12);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(txt, x + w / 2, y + h / 2);
}

function desenharBotaoQuizOpcao(x, y, w, h, txt, corFundo, corTexto, corBorda) {
  stroke(corBorda);
  strokeWeight(1.5);
  fill(corFundo);
  rect(x, y, w, h, 8);
  
  let idAlternativa = txt.substring(0, 2);
  let textoAlternativa = txt.substring(3);
  
  noStroke();
  fill(corTexto);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(idAlternativa, x + 18, y + h / 2);
  
  fill(51, 65, 85);
  textStyle(NORMAL);
  text(textoAlternativa, x + 46, y + h / 2);
}

// --- UTILITÁRIOS & TRATAMENTO DE INPUTS ---

function checarHover(x, y, w, h) {
  return (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h);
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

function dispararQuiz() {
  perguntaAtual = 0;
  respostaSelecionada = -1;
  feedback = "";
  pontuacao = 0;
  alphaTransicao = 0;
  tela = "quiz";
}

function mousePressed() {
  if (tela === "menu") {
    if (checarHover(width / 2 - 140, 245, 280, 52)) tela = "simulacao";
    if (checarHover(width / 2 - 140, 325, 280, 52)) dispararQuiz();
  } 
  else if (tela === "simulacao") {
    if (checarHover(width - 130, 25, 105, 38)) tela = "menu";
  } 
  else if (tela === "quiz") {
    let p = perguntas[perguntaAtual];
    if (respostaSelecionada === -1) {
      for (let i = 0; i < 4; i++) {
        let yPos = 165 + i * 54;
        if (checarHover(70, yPos, width - 140, 42)) {
          respostaSelecionada = i;
          if (i === p.correta) {
            feedback = "✔ DIAGNÓSTICO CORRETO — PARÂMETROS OPERACIONAIS OK";
            corFeedback = color(22, 163, 74);
            pontuacao++;
          } else {
            feedback = `✘ ANOMALIA DETECTADA — GABARITO CORRETO: ALINEA ${["A", "B", "C", "D"][p.correta]}`;
            corFeedback = color(220, 38, 38);
          }
        }
      }
    } else {
      if (checarHover(width - 215, 472, 145, 32)) {
        if (perguntaAtual < perguntas.length - 1) {
          perguntaAtual++;
          respostaSelecionada = -1;
          feedback = "";
          alphaTransicao = 0; // Reseta o fade para a nova questão
        } else {
          tela = "resultado";
        }
      }
    }
  } 
  else if (tela === "resultado") {
    if (checarHover(width / 2 - 140, 355, 280, 46)) dispararQuiz();
    if (checarHover(width / 2 - 140, 415, 280, 46)) tela = "simulacao";
  }
}

function keyPressed() {
  if (tela === "simulacao") {
    if (keyCode === UP_ARROW) velocidadeVento = min(velocidadeVento + 1, 16);
    else if (keyCode === DOWN_ARROW) velocidadeVento = max(velocidadeVento - 1, 0); 
  }
}