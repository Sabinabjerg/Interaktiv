function toggleMenu() {
    const menu = document.querySelector('.menu');
    const hamburger = document.querySelector('.hamburger i'); // Henter selve ikonet inde i hamburgeren
  
    menu.classList.toggle('show');
  
    // Skift ikon
    if (menu.classList.contains('show')) {
      hamburger.classList.remove('fa-bars');
      hamburger.classList.add('fa-xmark'); // FontAwesome kryds
    } else {
      hamburger.classList.remove('fa-xmark');
      hamburger.classList.add('fa-bars');
    }
  }

  
  const scenarios = {
    start: {
      text: "Du er logistik assistent i en mellemstor virksomhed og sidder foran din computer en sen eftermiddag, mens du gennemgår dine e-mails. Pludselig ser du en besked i din indbakke med emnelinjen: ''Vigtig besked fra leverandøren! Klik her for at læse dokumentet.'' Det ser officielt ud, men du havde ikke forventet en besked fra denne leverandør.",
      choices: [
        { text: "Ja, jeg klikker. Det kunne være vigtigt for virksomheden", next: "a" },
        { text: "Nej, det virker mistænkeligt. Jeg rapporterer mailen til IT-sikkerhedsteamet.", next: "b" }
      ]
    },
    a: {
      text: "Da du klikker, åbnes en hjemmeside, der ligner en velkendt leverandørs portal. Den beder dig om at logge ind med dine firmakontooplysninger. Uden at tænke videre indtaster du dine oplysninger. Kort tid efter begynder virksomhedens netværk at opføre sig mærkeligt. Medarbejdere kan ikke tilgå deres filer, og et pop-up-vindue dukker op på flere computere: ''Dine filer er blevet krypteret! Betal 10.000€ i Bitcoin for at få adgang igen.''",
      choices: [
        { text: "Jeg betaler løsesummen for at minimere nedetiden.", next: "c1"},
        { text: "Jeg kontakter IT-sikkerhedsteamet og følger beredskabsplanen.", next: "c2"}
      ]
    },
    b: {
      text: "Du vælger at ignorere mailen og videresender den til IT-sikkerhedsteamet. De bekræfter, at det var et phishing-angreb, og advarer resten af virksomheden. Senere får du en notifikation om, at der er en vigtig sikkerhedsopdatering til virksomhedens IT-systemer.",
      choices: [
        { text: "Ja, vi implementerer den straks på alle enheder.", next: "c3" },
        { text: "Nej, det kræver nedetid, så vi udsætter det til senere.", next: "c1" }
      ]
    },
    c1: {
      text: "Fordi du enten klikkede på linket eller undlod at installere opdateringen, har hackerne fået adgang til virksomhedens systemer. Med manglende sikkerhedsforanstaltninger var netværket sårbart, og nu er alle kritiske filer krypteret. Selvom virksomheden betaler, er der ingen garanti for, at dataene gendannes.",
      choices: [],
      ending: "bad"
    },
    c2: {
      text: "Du vælger ikke at betale hackerne og kontakter i stedet IT-sikkerhedsteamet. De isolerer de inficerede systemer og starter en gendannelse fra backup. Det lykkes delvist, men virksomheden oplever kortvarige driftsforstyrrelser. Hændelsen fører til en opdatering af virksomhedens sikkerhedsprocedurer.",
      choices: [],
      ending: "neutral"
    },
    c3: {
      text: "Du sikrer, at alle systemer opdateres med de nyeste sikkerhedsrettelser. Dagen efter hører du i nyhederne, at en ny type malware har ramt virksomheder, der ikke havde opdateret deres systemer. Takket være din hurtige handling forbliver virksomhedens IT-infrastruktur sikker.",
      choices: [],
      ending: "good"
  }
  };
  
  let currentNode = 'start';
  let userChoices = [];
  
  function showScenario(nodeKey) {
    const node = scenarios[nodeKey];
    currentNode = nodeKey;
  
    const container = document.getElementById('scenario');
    container.innerHTML = `
      <p>${node.text}</p>
      <div id="choices"></div>
    `;
  
    const choicesContainer = document.getElementById('choices');
  
    if ((!node.choices || node.choices.length === 0) && node.ending) {
      showEnding(node.ending);
      return;
    }
  
    node.choices.forEach(choice => {
      const button = document.createElement('button');
      button.textContent = choice.text;
      button.onclick = () => {
        userChoices.push({ question: node.text, choice: choice.text });
        showScenario(choice.next);
      };
      choicesContainer.appendChild(button);
    });
  }
  
  function showEnding(ending) {
    localStorage.setItem('userChoices', JSON.stringify(userChoices));
  
    const resultText = {
      good: "✅ Virksomheden undgår cyberangreb og opretholder sin drift uden problemer.",
      neutral: "⚠️ Virksomheden mister noget data, men kommer hurtigt tilbage.",
      bad: "❌ Virksomheden lider store økonomiske tab og omdømmeskade."
    };

    const endingNode = scenarios[currentNode];
  
    const container = document.getElementById('scenario');
    container.innerHTML = `
      <h2>Resultat</h2>
      <p>${resultText[ending]}</p>
      <p><em>${endingNode.text}</em></p>
      <h3>Dine valg:</h3>
      <ul>
        ${userChoices.map(c => `<li>${c.question}<br><strong>${c.choice}</strong></li>`).join('')}
      </ul>
      <button onclick="restart()">Start igen</button>
    `;
  }
  
  function restart() {
    userChoices = [];
    localStorage.removeItem('userChoices');
    currentNode = 'start';
    showScenario(currentNode);
  }
  
  const savedChoices = JSON.parse(localStorage.getItem('userChoices'));
  if (savedChoices && savedChoices.length > 0) {
    const container = document.getElementById('scenario');
    container.innerHTML = `
      <h2>Velkommen tilbage</h2>
      <p>Du har tidligere gennemført scenariet. Her er dine valg:</p>
      <ul>
        ${savedChoices.map(c => `<li>${c.question}<br><strong>${c.choice}</strong></li>`).join('')}
      </ul>
      <button onclick="restart()">Start forfra</button>
    `;
  } else {
    showScenario(currentNode);
  }