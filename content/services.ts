export type Faq = { q: string; a: string };
export type Step = { title: string; text: string };

export type Service = {
  slug: string;
  name: string; // short name used in nav, lists and the form select
  formValue: string; // value in the contact form "Leistung" select
  kind: "umzug" | "raeumung" | "moebel";
  metaTitle: string;
  metaDescription: string;
  h1: string;
  tagline: string; // one line for lists
  intro: string;
  answer: string; // direct, quotable answer (AEO)
  image: { src: string; alt: string };
  includes: string[];
  audience: string[];
  jobs: { title: string; text: string }[];
  process: Step[];
  prepare: string[];
  quoteInfo: string[];
  pricing: string[];
  extras: string[];
  area: string;
  faqs: Faq[];
  cta: string;
  posts: string[]; // related blog slugs
  related: string[]; // related service slugs
};

export const services: Service[] = [
  {
    slug: "privatumzug-graz",
    name: "Privatumzug",
    formValue: "privatumzug",
    kind: "umzug",
    metaTitle: "Privatumzug Graz: Umzugsfirma für Wohnung & Haus",
    metaDescription:
      "Privatumzug in Graz und der Steiermark: Tragen, Transport, Möbelmontage und Verpacken nach Bedarf. Individuelles Angebot, unverbindlich anfragen.",
    h1: "Privatumzug in Graz: Wohnung oder Haus, sorgfältig übersiedelt",
    tagline: "Wohnungs- und Hausumzüge in Graz, der Steiermark und nach Absprache österreichweit.",
    intro:
      "Ob Garçonnière im Lend, Altbauwohnung in St. Leonhard oder Einfamilienhaus in Graz-Umgebung: Wir übernehmen Ihren Umzug so, wie Sie ihn brauchen, vom reinen Tragen und Transportieren bis zum Abbau, Aufbau und Verpacken.",
    answer:
      "Die Anpacker führen Privatumzüge von Wohnungen und Häusern in Graz und der ganzen Steiermark durch. Je nach Wunsch umfasst der Umzug Tragen, Transport, Möbeldemontage und -montage sowie das Verpacken. Der Preis wird individuell nach Volumen, Stockwerken, Lift, Tragewegen, Entfernung und gewünschten Zusatzleistungen kalkuliert.",
    image: {
      src: "/images/privatumzug-kartons-packen.webp",
      alt: "Frau packt in einem Wohnzimmer Umzugskartons",
    },
    includes: [
      "Tragen von Möbeln, Kartons und Haushaltsgeräten, auch über enge Stiegenhäuser",
      "Transport von der alten zur neuen Adresse",
      "Schutz von Möbeln mit Decken und Polstermaterial während des Transports",
      "Abbau und Aufbau von Kästen, Betten und Regalen auf Wunsch",
      "Verpacken und Auspacken einzelner Bereiche, wenn Sie das nicht selbst übernehmen möchten",
      "Kombination mit einer Entrümpelung von Keller oder Dachboden",
    ],
    audience: [
      "Mieterinnen und Mieter, die innerhalb von Graz übersiedeln",
      "Familien, die in ein Haus in Graz-Umgebung oder der Steiermark ziehen",
      "Studierende und Berufstätige mit kleiner Wohnung und wenig Zeit",
      "Ältere Menschen, die in eine kleinere Wohnung oder ein betreutes Wohnen wechseln",
      "Alle, die nach Graz ziehen oder Graz in Richtung anderes Bundesland verlassen",
    ],
    jobs: [
      { title: "Wohnungsumzug innerhalb von Graz", text: "Typisch: zwei bis drei Zimmer, Altbau ohne Lift oder Neubau mit Tiefgarage. Entscheidend sind Stockwerke, Tragewege und die Parksituation vor dem Haus." },
      { title: "Hausumzug in der Steiermark", text: "Mehr Volumen, oft Keller, Garage und Garten. Wir planen Fahrzeuggröße, Personal und Zeitrahmen entsprechend." },
      { title: "Teilumzug", text: "Nur einige Möbel und Kartons, etwa beim Zusammenziehen oder wenn ein Teil des Haushalts eingelagert bleibt." },
      { title: "Umzug von oder nach Graz", text: "Fahrten in andere Bundesländer stimmen wir nach Umfang und Entfernung individuell ab." },
    ],
    process: [
      { title: "Anfrage", text: "Sie schicken uns Adressen, Stockwerke, Lift-Situation, Wunschtermin und eine kurze Beschreibung, gerne mit Fotos." },
      { title: "Abstimmung", text: "Wir klären offene Fragen telefonisch oder per WhatsApp. Bei größeren Umzügen vereinbaren wir bei Bedarf einen Besichtigungstermin." },
      { title: "Angebot", text: "Sie erhalten ein individuelles Angebot mit dem vereinbarten Leistungsumfang." },
      { title: "Umzugstag", text: "Wir tragen, schützen, transportieren und bauen auf, was vereinbart ist. Danach gehen wir gemeinsam mit Ihnen durch die neue Wohnung." },
    ],
    prepare: [
      "Kartons rechtzeitig packen und beschriften (Raum und Inhalt), schwere Dinge in kleine Kartons",
      "Zerbrechliches gesondert kennzeichnen",
      "Wertsachen, Dokumente und Medikamente selbst transportieren",
      "Kühlschrank rechtzeitig abtauen, Waschmaschine entleeren",
      "Mit der Hausverwaltung klären, ob Lift und Zufahrt nutzbar sind",
      "Eine Halte- oder Ladezone vor dem Haus rechtzeitig organisieren, wenn die Parksituation knapp ist",
    ],
    quoteInfo: [
      "Abhol- und Zieladresse inklusive Postleitzahl",
      "Stockwerk an beiden Adressen und ob ein Lift vorhanden ist",
      "Ungefähre Wohnungsgröße bzw. Anzahl der Zimmer",
      "Große oder schwere Einzelstücke (z. B. Klavier, Eckcouch, Vollholzkasten)",
      "Welche Möbel ab- und aufgebaut werden sollen",
      "Wunschtermin oder möglicher Zeitraum",
      "Fotos der Räume, das macht die Einschätzung deutlich genauer",
    ],
    pricing: [
      "Einen Pauschalpreis, der für jeden Umzug passt, gibt es nicht. Der Aufwand hängt davon ab, wie viel transportiert wird, wie weit getragen werden muss und welche Arbeiten zusätzlich anfallen.",
      "Deshalb kalkulieren wir jedes Angebot auf Basis Ihrer Angaben. Je genauer die Beschreibung und je aussagekräftiger die Fotos, desto treffender wird das Angebot.",
    ],
    extras: [
      "Möbeldemontage und -montage",
      "Verpackungsservice für einzelne Bereiche",
      "Entrümpelung von Keller, Dachboden oder Garage",
      "Einzeltransporte nach dem Umzug, etwa für nachgekaufte Möbel",
    ],
    area:
      "Unser Schwerpunkt liegt in Graz und Graz-Umgebung sowie in der gesamten Steiermark. Umzüge in andere Bundesländer, etwa nach Wien, Kärnten oder Oberösterreich, sind nach Absprache möglich.",
    faqs: [
      { q: "Wie früh sollte ich einen Umzug in Graz anfragen?", a: "So früh wie möglich, sobald der Termin ungefähr feststeht. Monatsenden und Wochenenden sind besonders gefragt. Kurzfristige Anfragen sind trotzdem willkommen, wir sagen Ihnen offen, ob der Termin machbar ist." },
      { q: "Muss ich selbst packen?", a: "Nein. Viele Kundinnen und Kunden packen selbst, um Kosten zu sparen. Wenn Sie Unterstützung möchten, vereinbaren wir das Verpacken einzelner Räume oder des ganzen Haushalts im Angebot." },
      { q: "Was ist, wenn es keinen Lift gibt?", a: "Kein Problem, das ist in Grazer Altbauten häufig. Wir brauchen nur die genaue Stockwerksangabe, damit wir Personal und Zeit richtig planen." },
      { q: "Übernehmen Sie auch Umzüge außerhalb der Steiermark?", a: "Ja, nach Absprache. Bei längeren Strecken hängt die Machbarkeit von Umfang, Termin und Entfernung ab. Schreiben Sie uns einfach beide Adressen." },
      { q: "Was muss ich nach dem Umzug in Österreich erledigen?", a: "Unter anderem die Anmeldung des neuen Wohnsitzes innerhalb von drei Tagen nach dem Bezug. Eine ausführliche Liste finden Sie in unserer Umzugs-Checkliste." },
    ],
    cta: "Umzug besprechen",
    posts: ["umzug-graz-kosten", "umzugsangebot-vergleichen", "umzug-graz-checkliste", "umzug-eine-woche-vorher", "umzug-graz-umgebung", "umzug-kurzfristig-organisieren"],
    related: ["moebeldemontage-montage-graz", "entruempelung-graz", "moebeltransport-graz"],
  },
  {
    slug: "firmenumzug-graz",
    name: "Firmen- & Büroumzug",
    formValue: "firmenumzug",
    kind: "umzug",
    metaTitle: "Firmenumzug & Büroumzug Graz: Übersiedlung planen",
    metaDescription:
      "Firmen- und Büroumzug in Graz und der Steiermark: Arbeitsplätze, Möbel, Akten und Technik strukturiert übersiedelt, Termin passend zum Betrieb.",
    h1: "Firmenumzug in Graz: Ihr Büro, strukturiert übersiedelt",
    tagline: "Büros, Praxen, Kanzleien und kleinere Betriebe, geplant nach Ihrem Arbeitsalltag.",
    intro:
      "Ein Standortwechsel soll den Betrieb so wenig wie möglich unterbrechen. Wir planen die Übersiedlung Ihres Büros, Ihrer Praxis oder Ihres Geschäftslokals gemeinsam mit Ihnen, mit klarer Reihenfolge, beschrifteten Arbeitsplätzen und einem Termin, der zu Ihrem Betrieb passt.",
    answer:
      "Die Anpacker übernehmen Firmen- und Büroumzüge in Graz und der Steiermark: Transport von Büromöbeln, Arbeitsplätzen, Akten und Ausstattung, Ab- und Aufbau von Möbeln sowie die Räumung nicht mehr benötigter Einrichtung. Termine, auch außerhalb der Geschäftszeiten, werden individuell vereinbart.",
    image: {
      src: "/images/firmenumzug-buero-arbeitsplaetze.webp",
      alt: "Großraumbüro mit Arbeitsplätzen und Ziegelwand",
    },
    includes: [
      "Transport von Schreibtischen, Bürostühlen, Kästen und Besprechungsmöbeln",
      "Ab- und Aufbau von Büromöbeln nach Plan",
      "Transport von Akten und Archivkartons in festgelegter Reihenfolge",
      "Sorgfältiger Transport von Bildschirmen, Druckern und anderer Ausstattung",
      "Räumung von Möbeln, die nicht mitübersiedeln",
      "Abstimmung mit Hausverwaltung und Zufahrt am alten und neuen Standort",
    ],
    audience: [
      "Büros und Agenturen, die innerhalb von Graz übersiedeln",
      "Arztpraxen, Kanzleien und Ordinationen",
      "Kleine und mittlere Unternehmen mit Lager oder Geschäftslokal",
      "Vereine und Organisationen mit Büroräumen",
    ],
    jobs: [
      { title: "Büroübersiedlung innerhalb von Graz", text: "Arbeitsplätze, Besprechungsraum und Archiv: oft mit dem Ziel, am nächsten Werktag wieder arbeiten zu können." },
      { title: "Umzug einer Praxis oder Kanzlei", text: "Viele Akten, sensible Unterlagen und eingeschränkte Zeitfenster. Diskretion und eine saubere Reihenfolge stehen im Vordergrund." },
      { title: "Teilübersiedlung", text: "Eine Abteilung wechselt das Stockwerk oder das Gebäude, der Rest arbeitet weiter." },
      { title: "Büroauflösung", text: "Ein Standort wird aufgegeben: Wir übersiedeln, was gebraucht wird, und räumen den Rest." },
    ],
    process: [
      { title: "Bestandsaufnahme", text: "Sie schildern Standort, Anzahl der Arbeitsplätze, Archivumfang und Zeitrahmen. Bei größeren Projekten sehen wir uns die Räume vorab an." },
      { title: "Planung", text: "Wir legen Reihenfolge, Beschriftung und Zuständigkeiten fest: wer packt was, was wird abgebaut, was zuerst gebraucht." },
      { title: "Angebot", text: "Sie erhalten ein Angebot mit klar beschriebenem Leistungsumfang und vereinbartem Termin." },
      { title: "Übersiedlung", text: "Abbau, Transport und Aufbau nach Plan. Am neuen Standort stehen die Möbel dort, wo sie hingehören." },
    ],
    prepare: [
      "Eine verantwortliche Ansprechperson im Unternehmen festlegen",
      "Grundriss des neuen Standorts mit Möbelplanung bereitstellen",
      "Mitarbeitende bitten, den eigenen Arbeitsplatz zu packen und zu beschriften",
      "IT-Abbau und -Inbetriebnahme mit Ihrer IT-Betreuung abstimmen",
      "Zufahrt, Ladezone und Lift an beiden Standorten klären",
      "Aussortieren, bevor gepackt wird. Was nicht mitkommt, kann direkt geräumt werden",
    ],
    quoteInfo: [
      "Alter und neuer Standort mit Stockwerk und Lift",
      "Anzahl der Arbeitsplätze und Besprechungsräume",
      "Umfang von Archiv und Akten (z. B. Laufmeter oder Anzahl der Kästen)",
      "Welche Möbel ab- und aufgebaut werden müssen",
      "Gewünschter Zeitraum und mögliche Arbeitszeiten (Abend, Wochenende)",
      "Möbel oder Geräte, die nicht mitübersiedeln sollen",
    ],
    pricing: [
      "Bei Firmenumzügen bestimmen vor allem Volumen, Anzahl der abzubauenden Möbel, Tragewege und das Zeitfenster den Aufwand.",
      "Wir erstellen das Angebot auf Basis Ihrer Angaben und, bei größeren Standorten, einer Besichtigung. So wissen Sie vorab, welche Leistungen enthalten sind.",
    ],
    extras: [
      "Räumung und Entsorgung alter Büromöbel nach Absprache",
      "Einzeltransporte von Möbeln zwischen Standorten",
      "Montage neuer Büromöbel",
    ],
    area:
      "Firmenumzüge führen wir vor allem in Graz, Graz-Umgebung und der Steiermark durch. Standortwechsel in andere Bundesländer stimmen wir projektbezogen ab.",
    faqs: [
      { q: "Können Sie auch am Wochenende oder abends übersiedeln?", a: "Das klären wir im Einzelfall. Viele Betriebe möchten den Umzug außerhalb der Geschäftszeiten erledigen. Sagen Sie uns Ihr gewünschtes Zeitfenster schon bei der Anfrage." },
      { q: "Wer kümmert sich um die IT?", a: "Den physischen Transport von Bildschirmen, Rechnern und Druckern übernehmen wir. Das Abstecken, Sichern und Inbetriebnehmen der IT sollte Ihre IT-Betreuung übernehmen." },
      { q: "Wie gehen Sie mit vertraulichen Akten um?", a: "Akten werden verschlossen in Kartons transportiert und bleiben im Fahrzeug unter unserer Aufsicht. Besondere Anforderungen besprechen wir vorab." },
      { q: "Was passiert mit Möbeln, die nicht mitübersiedeln?", a: "Wir können sie im Zuge des Umzugs räumen. Was mit den Gegenständen geschieht, vereinbaren wir vorher gemeinsam." },
    ],
    cta: "Firmenumzug anfragen",
    posts: ["firmenumzug-graz-planen", "firmenuebersiedlung-adressaenderung"],
    related: ["moebeldemontage-montage-graz", "entruempelung-graz", "moebeltransport-graz"],
  },
  {
    slug: "entruempelung-graz",
    name: "Entrümpelung & Räumung",
    formValue: "entruempelung",
    kind: "raeumung",
    metaTitle: "Entrümpelung Graz: Wohnung, Keller, Dachboden räumen",
    metaDescription:
      "Entrümpelung in Graz und der Steiermark: Wohnung, Haus, Keller, Dachboden oder Garage räumen lassen. Umfang und Termin individuell abgestimmt.",
    h1: "Entrümpelung in Graz: Platz schaffen, ohne selbst zu schleppen",
    tagline: "Wohnungen, Häuser, Keller, Dachböden und Garagen, ganz oder teilweise geräumt.",
    intro:
      "Ein voller Keller, ein Dachboden mit Jahrzehnten an Erinnerungen oder eine Wohnung, die vor der Übergabe leer sein muss: Wir räumen, tragen und transportieren ab, und besprechen mit Ihnen vorher genau, was bleibt und was gehen darf.",
    image: {
      src: "/images/entruempelung-kartons-raum.webp",
      alt: "Raum voller gestapelter Kartons und Schachteln",
    },
    answer:
      "Die Anpacker entrümpeln Wohnungen, Häuser, Keller, Dachböden, Garagen und Geschäftsräume in Graz und der Steiermark. Vor der Räumung wird gemeinsam festgelegt, welche Gegenstände bleiben, aufbewahrt oder abtransportiert werden. Der Preis richtet sich nach Menge, Zugänglichkeit, Tragewegen und Art der Gegenstände.",
    includes: [
      "Räumung ganzer Wohnungen und Häuser oder einzelner Räume",
      "Kellerentrümpelung und Dachbodenräumung, auch bei engen Zugängen",
      "Garagen, Abstellräume und Schuppen",
      "Zerlegen sperriger Möbel für den Abtransport",
      "Abtransport der Gegenstände nach vorheriger Abstimmung",
      "Besenreine Übergabe der geräumten Flächen, wenn vereinbart",
    ],
    audience: [
      "Mieterinnen und Mieter vor der Wohnungsübergabe",
      "Eigentümerinnen und Eigentümer vor Verkauf oder Sanierung",
      "Hausverwaltungen bei zurückgelassenen Gegenständen",
      "Familien, die Keller oder Dachboden endlich freibekommen möchten",
    ],
    jobs: [
      { title: "Kellerentrümpelung", text: "Oft schmale Stiegen, wenig Licht und viel Gewicht. Wir planen Tragewege und Personal entsprechend." },
      { title: "Dachboden entrümpeln", text: "Steile Treppen, Hitze im Sommer, alte Möbel und Kisten. Wir zerlegen, wo nötig, und tragen sicher ab." },
      { title: "Wohnungsräumung vor der Übergabe", text: "Die Wohnung muss bis zu einem fixen Datum leer sein. Wir richten uns nach Ihrem Übergabetermin." },
      { title: "Garage und Nebengebäude", text: "Werkzeug, Reifen, Gartengeräte, Altmöbel: Wir sortieren gemeinsam mit Ihnen, was mitgenommen wird." },
    ],
    process: [
      { title: "Anfrage mit Fotos", text: "Fotos aller Räume sind bei Entrümpelungen besonders hilfreich. Damit lässt sich der Umfang gut einschätzen." },
      { title: "Klärung", text: "Wir besprechen, was bleiben soll, was aufbewahrt wird und was abtransportiert werden darf. Bei Bedarf sehen wir uns das Objekt an." },
      { title: "Angebot", text: "Sie erhalten ein Angebot mit dem vereinbarten Räumungsumfang." },
      { title: "Räumung", text: "Wir räumen wie besprochen und übergeben die Flächen im vereinbarten Zustand." },
    ],
    prepare: [
      "Dokumente, Fotos, Schlüssel und Wertsachen vorab heraussuchen",
      "Gegenstände, die bleiben sollen, deutlich markieren oder in einen eigenen Raum stellen",
      "Klären, ob Strom und Licht in Keller oder Dachboden vorhanden sind",
      "Zugang und Schlüssel für Keller, Dachboden und Garage bereithalten",
      "Bei Mietobjekten mit der Hausverwaltung den Übergabezustand klären",
    ],
    quoteInfo: [
      "Adresse und Objektart (Wohnung, Haus, Keller, Dachboden, Garage)",
      "Welche Bereiche geräumt werden sollen",
      "Ungefährer Umfang, am besten mit Fotos jedes Raums",
      "Stockwerk, Lift und Länge der Tragewege",
      "Besondere Gegenstände (z. B. Klavier, Tresor, sehr schwere Möbel)",
      "Gewünschter Termin oder Übergabedatum",
    ],
    pricing: [
      "Bei einer Entrümpelung hängt der Aufwand von Menge und Art der Gegenstände, der Zugänglichkeit und den Tragewegen ab. Ein voller Dachboden im vierten Stock ohne Lift ist etwas anderes als eine ebenerdige Garage.",
      "Wir kalkulieren deshalb individuell. Fotos helfen uns, schon vor einer Besichtigung eine realistische Einschätzung zu geben.",
    ],
    extras: [
      "Kombination mit einem Umzug",
      "Möbeldemontage vor dem Abtransport",
      "Transport einzelner Stücke, die Sie behalten oder verschenken möchten",
    ],
    area:
      "Entrümpelungen führen wir in Graz, Graz-Umgebung und der gesamten Steiermark durch. Größere Räumungen außerhalb der Steiermark sind nach Absprache möglich.",
    faqs: [
      { q: "Was passiert mit den Gegenständen?", a: "Das vereinbaren wir vor der Räumung gemeinsam mit Ihnen. Was Sie behalten möchten, wird beiseitegestellt; was abtransportiert werden soll, legen wir im Angebot fest." },
      { q: "Muss ich bei der Entrümpelung anwesend sein?", a: "Nicht zwingend. Wichtig ist, dass vorher klar abgesprochen ist, was geräumt wird, und dass wir Zugang zum Objekt haben." },
      { q: "Können Sie auch nur den Keller räumen?", a: "Ja. Wir übernehmen auch einzelne Räume wie Keller, Dachboden, Abstellraum oder Garage." },
      { q: "Wie schnell ist eine Entrümpelung möglich?", a: "Das hängt von unserer Auslastung und vom Umfang ab. Nennen Sie uns Ihren Wunschtermin oder das Übergabedatum. Wir sagen Ihnen offen, was machbar ist." },
    ],
    cta: "Räumung anfragen",
    posts: ["entruempelung-graz-ablauf", "entruempelung-entsorgung-graz", "keller-dachboden-entruempeln", "wohnung-raeumen-graz"],
    related: ["haushaltsaufloesung-verlassenschaft-graz", "messiewohnung-raeumung-graz", "privatumzug-graz"],
  },
  {
    slug: "haushaltsaufloesung-verlassenschaft-graz",
    name: "Haushaltsauflösung & Verlassenschaft",
    formValue: "haushaltsaufloesung",
    kind: "raeumung",
    metaTitle: "Haushaltsauflösung & Verlassenschaftsräumung Graz",
    metaDescription:
      "Haushaltsauflösung und Verlassenschaftsräumung in Graz und der Steiermark: respektvoll, mit der Familie abgestimmt, mit Rücksicht auf Erinnerungen.",
    h1: "Haushaltsauflösung und Verlassenschaftsräumung in Graz",
    tagline: "Wenn ein ganzer Haushalt aufgelöst werden muss, mit Ruhe, Sorgfalt und klaren Absprachen.",
    intro:
      "Eine Haushaltsauflösung kommt selten zu einem guten Zeitpunkt. Oft steht ein Umzug ins Pflegeheim oder ein Todesfall dahinter. Wir nehmen Ihnen die körperliche Arbeit ab, gehen respektvoll mit dem Hausrat um und halten uns genau an das, was Sie mit uns vereinbaren.",
    answer:
      "Die Anpacker übernehmen Haushaltsauflösungen und Verlassenschaftsräumungen in Graz und der Steiermark. Gemeinsam mit den Angehörigen wird vorab festgelegt, welche Gegenstände aufbewahrt, an Familienmitglieder transportiert oder abtransportiert werden. Bei Verlassenschaften sollte vor der Räumung geklärt sein, wer über den Nachlass verfügen darf.",
    image: {
      src: "/images/haushaltsaufloesung-erinnerungsstuecke.webp",
      alt: "Karton mit gerahmten Fotos und Erinnerungsstücken auf einem Autorücksitz",
    },
    includes: [
      "Vollständige Räumung von Wohnung oder Haus",
      "Aussortieren gemeinsam mit Angehörigen oder nach klarer Liste",
      "Sicherstellen von Dokumenten, Fotos und Erinnerungsstücken, die beim Räumen auftauchen",
      "Transport einzelner Möbel oder Kartons zu Familienmitgliedern",
      "Abtransport aller übrigen Gegenstände nach Absprache",
      "Übergabe der Räume im vereinbarten Zustand, z. B. besenrein",
    ],
    audience: [
      "Angehörige nach einem Todesfall",
      "Familien, deren Eltern in ein Pflegeheim oder betreutes Wohnen übersiedeln",
      "Erbinnen und Erben, die nicht in Graz wohnen",
      "Erwachsenenvertreterinnen und -vertreter sowie Hausverwaltungen",
    ],
    jobs: [
      { title: "Auflösung nach Umzug ins Pflegeheim", text: "Einige Möbel und persönliche Dinge übersiedeln mit, der restliche Haushalt wird aufgelöst." },
      { title: "Verlassenschaftsräumung", text: "Die Wohnung einer verstorbenen Person wird geräumt, nachdem geklärt ist, wer darüber verfügen darf." },
      { title: "Räumung für Angehörige aus der Ferne", text: "Wenn Sie nicht vor Ort sein können, stimmen wir alles per Telefon, WhatsApp und Fotos mit Ihnen ab." },
      { title: "Hausauflösung", text: "Ein ganzes Haus mit Keller, Dachboden und Nebengebäuden: Schritt für Schritt geplant." },
    ],
    process: [
      { title: "Erstes Gespräch", text: "Sie erzählen uns, worum es geht und welche Fristen es gibt. Wir hören zu und fragen nach, was Ihnen wichtig ist." },
      { title: "Liste und Klärung", text: "Gemeinsam wird festgelegt, was aufbewahrt, an wen geliefert und was abtransportiert werden soll." },
      { title: "Angebot", text: "Auf Basis der Absprachen, der Fotos oder einer Besichtigung erhalten Sie ein individuelles Angebot." },
      { title: "Räumung", text: "Wir räumen sorgfältig und melden uns, wenn wir auf Dokumente, Fotos oder Wertgegenstände stoßen." },
    ],
    prepare: [
      "Bei einer Verlassenschaft klären, wer über den Nachlass verfügen darf, im Zweifel beim zuständigen Notariat (Gerichtskommissär)",
      "Wichtige Unterlagen, Schmuck und Erinnerungsstücke vorab sichern",
      "Mit der Familie besprechen, wer welche Stücke übernehmen möchte",
      "Kündigungsfristen der Wohnung und den Übergabetermin klären",
      "Schlüssel für Wohnung, Keller und Briefkasten bereithalten",
    ],
    quoteInfo: [
      "Adresse, Objektart und Wohnungsgröße",
      "Stockwerk, Lift und Zugang zu Keller oder Dachboden",
      "Was aufbewahrt oder an Angehörige geliefert werden soll",
      "Fotos der Räume",
      "Fixe Termine, etwa Übergabe an Vermieter oder Hausverwaltung",
    ],
    pricing: [
      "Der Aufwand einer Haushaltsauflösung hängt von der Menge des Hausrats, den Tragewegen, dem Anteil an Gegenständen, die gesondert behandelt werden sollen, und vom Zeitrahmen ab.",
      "Wir erstellen jedes Angebot individuell und besprechen den Leistungsumfang mit Ihnen, bevor wir beginnen.",
    ],
    extras: [
      "Transport einzelner Möbel zu Angehörigen, auch in andere Bundesländer nach Absprache",
      "Möbeldemontage",
      "Kombination mit einem Umzug ins Pflegeheim oder in eine kleinere Wohnung",
    ],
    area:
      "Wir sind in Graz, Graz-Umgebung und der ganzen Steiermark für Sie da. Für Angehörige, die weiter entfernt wohnen, organisieren wir die Abstimmung gerne vollständig aus der Ferne.",
    faqs: [
      { q: "Wann darf eine Verlassenschaft geräumt werden?", a: "Grundsätzlich sollte vorher geklärt sein, wer über den Nachlass verfügen darf. In Österreich wird das Verlassenschaftsverfahren von einer Notarin oder einem Notar als Gerichtskommissär abgewickelt, dort erhalten Sie verbindliche Auskunft. Wir beginnen erst, wenn Sie uns den Auftrag geben." },
      { q: "Was passiert, wenn Sie beim Räumen Dokumente oder Fotos finden?", a: "Persönliche Unterlagen, Fotos und offensichtliche Wertgegenstände legen wir beiseite und stimmen mit Ihnen ab, was damit passieren soll." },
      { q: "Muss ich bei der Räumung dabei sein?", a: "Nein. Viele Angehörige können oder möchten nicht dabei sein. Dann arbeiten wir nach einer klaren Absprache und halten Sie per Telefon oder WhatsApp auf dem Laufenden." },
      { q: "Können einzelne Möbel zu Familienmitgliedern gebracht werden?", a: "Ja. Solche Transporte nehmen wir gerne in das Angebot auf." },
    ],
    cta: "Haushaltsauflösung besprechen",
    posts: ["verlassenschaftsraeumung-graz", "wohnung-raeumen-graz", "umzug-im-alter", "entruempelung-entsorgung-graz"],
    related: ["entruempelung-graz", "moebeltransport-graz", "messiewohnung-raeumung-graz"],
  },
  {
    slug: "messiewohnung-raeumung-graz",
    name: "Räumung stark überfüllter Wohnungen",
    formValue: "messiewohnung",
    kind: "raeumung",
    metaTitle: "Messiewohnung räumen Graz: diskret & respektvoll",
    metaDescription:
      "Räumung stark überfüllter Wohnungen (Messiewohnung) in Graz und der Steiermark: diskret, ohne Bewertung und Schritt für Schritt geplant. Vertraulich anfragen.",
    h1: "Messiewohnung räumen in Graz, diskret und ohne Vorwürfe",
    tagline: "Stark überfüllte Wohnungen, vertraulich und Schritt für Schritt geräumt.",
    intro:
      "Wenn sich in einer Wohnung über Jahre sehr viel angesammelt hat, ist der erste Anruf oft der schwerste Schritt. Wir urteilen nicht. Wir hören zu, sehen uns die Situation an und räumen so diskret wie möglich, egal, ob Sie selbst betroffen sind oder sich um einen Angehörigen kümmern.",
    answer:
      "Die Anpacker räumen stark überfüllte Wohnungen und Häuser, umgangssprachlich Messiewohnungen, in Graz und der Steiermark. Jeder Auftrag wird individuell eingeschätzt, häufig nach Fotos oder einer Besichtigung. Die Räumung erfolgt diskret und in Abstimmung mit den Betroffenen oder Angehörigen.",
    image: {
      src: "/images/raeumung-ueberfuellter-raum.webp",
      alt: "Tisch voller Papiere, Bücher und verschiedener Gegenstände",
    },
    includes: [
      "Räumung stark überfüllter Wohnungen, Häuser und einzelner Räume",
      "Behutsames Vorgehen, bei Bedarf in mehreren Etappen",
      "Beiseitelegen von Dokumenten, Fotos und persönlichen Dingen",
      "Abtransport nach vorheriger Abstimmung",
      "Unauffälliges Arbeiten mit Rücksicht auf Nachbarschaft und Privatsphäre",
    ],
    audience: [
      "Betroffene, die sich Unterstützung wünschen",
      "Angehörige, die helfen möchten",
      "Erwachsenenvertretungen und soziale Einrichtungen",
      "Vermieterinnen, Vermieter und Hausverwaltungen",
    ],
    jobs: [
      { title: "Teilweise überfüllte Wohnung", text: "Einzelne Räume sind kaum noch nutzbar, der Rest ist bewohnbar. Wir schaffen gezielt wieder Platz." },
      { title: "Vollständig überfüllte Wohnung", text: "Wege sind zugestellt, Räume nicht mehr zugänglich. Hier planen wir besonders sorgfältig und oft in Etappen." },
      { title: "Räumung nach Auszug oder Todesfall", text: "Die Wohnung muss für die Übergabe geräumt werden: in Abstimmung mit Angehörigen oder Verwaltung." },
    ],
    process: [
      { title: "Vertrauliches Gespräch", text: "Sie schildern die Situation telefonisch, per WhatsApp oder über das Formular. Fotos helfen, sind aber kein Muss." },
      { title: "Einschätzung", text: "Wir schätzen Umfang und Aufwand ein. Meist ist hier eine Besichtigung sinnvoll." },
      { title: "Angebot und Plan", text: "Sie erhalten ein individuelles Angebot. Wir legen gemeinsam fest, was gesucht und aufbewahrt werden soll." },
      { title: "Räumung", text: "Wir arbeiten ruhig und diskret, auf Wunsch in mehreren Schritten." },
    ],
    prepare: [
      "Nichts. Sie müssen nicht vorher aufräumen",
      "Wenn möglich: eine Liste von Dingen, die unbedingt gefunden werden sollen (z. B. Dokumente, Fotos, Schlüssel)",
      "Bei Mietwohnungen die Frist für die Übergabe kennen",
      "Hinweise auf Besonderheiten geben, etwa Schimmel, Ungeziefer oder Tiere. Das ist wichtig für unsere Planung und bleibt vertraulich",
    ],
    quoteInfo: [
      "Adresse, Wohnungsgröße, Stockwerk und Lift",
      "Wie stark die Räume gefüllt sind (Fotos sind sehr hilfreich)",
      "Ob Besonderheiten wie Schimmel, Ungeziefer oder Haustiere bekannt sind",
      "Was gesucht oder aufbewahrt werden soll",
      "Gewünschter Zeitraum oder Übergabetermin",
    ],
    pricing: [
      "Stark überfüllte Wohnungen unterscheiden sich enorm: Menge, Gewicht, Zustand der Gegenstände und die Zugänglichkeit bestimmen den Aufwand.",
      "Deshalb gibt es hier keine Pauschalen. Nach Fotos oder einer Besichtigung erhalten Sie ein individuelles Angebot.",
    ],
    extras: [
      "Räumung in Etappen, wenn die Situation das erfordert",
      "Transport von Möbeln und Gegenständen, die behalten werden",
      "Kombination mit einer Übersiedlung in eine neue Wohnung",
    ],
    area:
      "Wir übernehmen solche Räumungen in Graz, Graz-Umgebung und der Steiermark. Anfragen aus anderen Bundesländern prüfen wir individuell.",
    faqs: [
      { q: "Wird das diskret behandelt?", a: "Ja. Ihre Anfrage und alles, was wir in der Wohnung sehen, behandeln wir vertraulich. Auf Wunsch arbeiten wir möglichst unauffällig gegenüber der Nachbarschaft." },
      { q: "Muss die betroffene Person zustimmen?", a: "Wir räumen nur im Auftrag von Personen, die über die Wohnung und ihren Inhalt verfügen dürfen. Wenn das unklar ist, sprechen Sie uns an, das klären wir vor jedem Auftrag." },
      { q: "Braucht es eine Desinfektion oder Spezialreinigung?", a: "Das hängt vom Zustand der Wohnung ab. Eine Desinfektion oder Schädlingsbekämpfung ist eine eigene Fachleistung; wir sagen Ihnen ehrlich, wenn wir das nicht selbst übernehmen." },
      { q: "Müssen wir vorher etwas aussortieren?", a: "Nein. Sagen Sie uns nur, was unbedingt gefunden und aufbewahrt werden soll." },
    ],
    cta: "Vertraulich anfragen",
    posts: ["messiewohnung-raeumen", "entruempelung-entsorgung-graz"],
    related: ["entruempelung-graz", "haushaltsaufloesung-verlassenschaft-graz"],
  },
  {
    slug: "moebeltransport-graz",
    name: "Möbeltransport",
    formValue: "moebeltransport",
    kind: "moebel",
    metaTitle: "Möbeltransport Graz: Einzeltransport & Möbeltaxi",
    metaDescription:
      "Möbeltransport in Graz und der Steiermark: einzelne Möbel abholen, tragen und liefern, vom Sofa bis zum Kasten. Fotos schicken, Angebot erhalten.",
    h1: "Möbeltransport in Graz: ein Stück oder mehrere",
    tagline: "Einzelne Möbelstücke abholen, sicher transportieren und an Ort und Stelle tragen.",
    intro:
      "Die Couch vom Kleinanzeigen-Inserat in Liebenau, der Kasten der Großeltern nach Gleisdorf oder das neue Bett aus dem Möbelhaus: Für einzelne Stücke braucht es keinen ganzen Umzug. Wir holen ab, tragen, sichern und liefern, auch in den vierten Stock ohne Lift.",
    answer:
      "Die Anpacker transportieren einzelne Möbelstücke und kleinere Ladungen in Graz und der Steiermark, etwa Sofas, Kästen, Betten, Tische oder Waschmaschinen. Inklusive Tragen an beiden Adressen und auf Wunsch mit Ab- und Aufbau. Für ein Angebot werden Abhol- und Lieferadresse, Stockwerke und Maße bzw. Fotos der Möbel benötigt.",
    image: {
      src: "/images/moebeltransport-stuehle-tragen.webp",
      alt: "Mann trägt mehrere Holzstühle in ein Gebäude",
    },
    includes: [
      "Abholung bei Privatpersonen, aus dem Möbelhaus oder aus dem Lager",
      "Tragen an Abhol- und Lieferadresse",
      "Sicherung mit Decken und Gurten während der Fahrt",
      "Abbau vor dem Transport und Aufbau danach, wenn gewünscht",
      "Transport von Haushaltsgeräten wie Waschmaschine oder Kühlschrank",
    ],
    audience: [
      "Käuferinnen und Käufer von gebrauchten Möbeln",
      "Alle ohne passendes Auto oder ohne helfende Hände",
      "Familien, die Erbstücke weitergeben",
      "Geschäfte und Unternehmen mit gelegentlichen Lieferungen",
    ],
    jobs: [
      { title: "Gebrauchtkauf abholen", text: "Sie haben ein Möbelstück online gekauft. Wir holen es ab und bringen es zu Ihnen." },
      { title: "Lieferung aus dem Möbelhaus", text: "Große Pakete oder bereits aufgebaute Möbel, die nicht ins eigene Auto passen." },
      { title: "Möbel innerhalb der Familie", text: "Der Kasten von den Eltern, der Tisch für die erste eigene Wohnung." },
      { title: "Kleinere Ladungen", text: "Ein paar Möbel und Kartons, für die sich ein kompletter Umzug nicht lohnt." },
    ],
    process: [
      { title: "Fotos und Maße", text: "Schicken Sie uns Fotos, ungefähre Maße und beide Adressen." },
      { title: "Angebot", text: "Sie erhalten ein Angebot und einen Terminvorschlag." },
      { title: "Abholung", text: "Wir tragen, sichern und laden das Möbelstück." },
      { title: "Lieferung", text: "Wir tragen es an den gewünschten Platz und bauen es auf, wenn vereinbart." },
    ],
    prepare: [
      "Maße des Möbelstücks und der Türen bzw. des Stiegenhauses prüfen",
      "Schubladen und Fächer leeren",
      "Mit Verkäuferin oder Verkäufer Abholzeit und Zugang abstimmen",
      "Am Zielort Platz freimachen",
    ],
    quoteInfo: [
      "Abhol- und Lieferadresse",
      "Stockwerke und Lift an beiden Adressen",
      "Fotos und ungefähre Maße des Möbelstücks",
      "Ob Ab- oder Aufbau nötig ist",
      "Wunschtermin oder Zeitfenster",
    ],
    pricing: [
      "Bei Möbeltransporten zählen vor allem Größe und Gewicht der Stücke, Stockwerke, Tragewege, Entfernung und ob ab- oder aufgebaut werden muss.",
      "Mit Fotos und Adressen können wir rasch ein individuelles Angebot erstellen.",
    ],
    extras: ["Möbeldemontage und -montage", "Kombination mehrerer Abholungen an einem Tag nach Absprache"],
    area:
      "Möbeltransporte führen wir in Graz, Graz-Umgebung und der Steiermark durch. Fahrten in andere Bundesländer, etwa von oder nach Wien, sind nach Absprache möglich.",
    faqs: [
      { q: "Transportieren Sie auch nur ein einziges Möbelstück?", a: "Ja. Einzeltransporte gehören zu unseren Leistungen, etwa ein Sofa, ein Kasten oder eine Waschmaschine." },
      { q: "Tragen Sie auch in den vierten Stock ohne Lift?", a: "Ja. Wir brauchen nur die Stockwerksangabe vorab, damit wir genug Personal einplanen." },
      { q: "Können Sie Möbel direkt beim Verkäufer abholen?", a: "Ja. Stimmen Sie Abholzeit und Adresse mit der Verkäuferin oder dem Verkäufer ab und geben Sie uns die Daten weiter." },
      { q: "Was, wenn das Möbelstück nicht durch die Tür passt?", a: "Deshalb fragen wir nach Maßen und Fotos. Oft lässt sich das Stück zerlegen. Das klären wir vorher." },
    ],
    cta: "Möbeltransport anfragen",
    posts: ["moebeltransport-graz-einzelstuecke", "moebel-umzug-vorbereiten"],
    related: ["moebeldemontage-montage-graz", "privatumzug-graz"],
  },
  {
    slug: "moebeldemontage-montage-graz",
    name: "Möbelmontage & Demontage",
    formValue: "moebelmontage",
    kind: "moebel",
    metaTitle: "Möbelmontage Graz: Abbau & Aufbau von Möbeln",
    metaDescription:
      "Möbelabbau und Möbelaufbau in Graz: Kästen, Betten, Regale und Büromöbel beim Umzug oder einzeln montiert. Umfang vorab abgestimmt, jetzt anfragen.",
    h1: "Möbelmontage in Graz: Abbau und Aufbau beim Umzug",
    tagline: "Kästen, Betten, Regale und Büromöbel, sauber zerlegt und wieder aufgebaut.",
    intro:
      "Große Kästen und Betten passen selten am Stück durchs Stiegenhaus. Wir zerlegen Ihre Möbel vor dem Umzug, sichern Schrauben und Beschläge und bauen am neuen Ort wieder auf. Auch neue Möbel montieren wir, beim Umzug oder als eigener Auftrag.",
    answer:
      "Die Anpacker bauen Möbel in Graz und der Steiermark ab und wieder auf, vor allem im Rahmen von Umzügen, aber auch als eigenständige Leistung. Dazu gehören Kästen, Betten, Regale, Tische und Büromöbel. Der genaue Umfang wird vorab festgelegt, damit klar ist, welche Möbel montiert werden.",
    image: {
      src: "/images/moebelmontage-regal-aufbauen.webp",
      alt: "Person baut ein Holzregal am Boden zusammen",
    },
    includes: [
      "Abbau von Kästen, Betten, Regalen und Tischen vor dem Transport",
      "Beschriften und Sichern von Schrauben, Beschlägen und Einzelteilen",
      "Aufbau am neuen Standort",
      "Montage neu gekaufter Möbel nach Anleitung",
      "Ab- und Aufbau von Büromöbeln",
    ],
    audience: [
      "Kundinnen und Kunden eines Umzugs, die nicht selbst schrauben möchten",
      "Käuferinnen und Käufer neuer Möbel",
      "Büros, die Arbeitsplätze umbauen oder übersiedeln",
    ],
    jobs: [
      { title: "Schlafzimmerkasten", text: "Große Drehtüren- oder Schiebetürenkästen sind der Klassiker. Sie müssen fast immer zerlegt werden." },
      { title: "Betten und Hochbetten", text: "Abbau, Transport und Aufbau inklusive Lattenrost." },
      { title: "Regale und Wohnwände", text: "Mehrteilige Möbel, die beim Aufbau genau ausgerichtet werden müssen." },
      { title: "Büromöbel", text: "Schreibtische, Rollcontainer und Aktenkästen beim Büroumzug." },
    ],
    process: [
      { title: "Liste der Möbel", text: "Sie nennen uns, welche Möbel ab- oder aufgebaut werden sollen. Fotos helfen." },
      { title: "Abstimmung", text: "Wir klären Sonderfälle wie Wandbefestigungen, Einbaumöbel oder fehlende Anleitungen." },
      { title: "Angebot", text: "Der vereinbarte Montageumfang steht im Angebot." },
      { title: "Montage", text: "Wir zerlegen, transportieren und bauen auf wie besprochen." },
    ],
    prepare: [
      "Kästen und Schubladen vollständig leeren",
      "Aufbauanleitungen bereitlegen, falls vorhanden",
      "Bei neuen Möbeln alle Pakete in einen Raum stellen",
      "Klären, ob Möbel an der Wand befestigt werden dürfen",
    ],
    quoteInfo: [
      "Welche Möbel ab- und/oder aufgebaut werden sollen",
      "Fotos, Hersteller oder Modell, falls bekannt",
      "Ob Wandbefestigungen nötig sind",
      "Adresse(n) und Stockwerk",
      "Ob die Montage Teil eines Umzugs ist",
    ],
    pricing: [
      "Der Aufwand richtet sich nach Anzahl, Größe und Bauart der Möbel. Ein einfaches Bücherregal ist schneller aufgebaut als ein raumhoher Schiebetürenkasten.",
      "Wir legen den Montageumfang im Angebot fest, damit für beide Seiten klar ist, was enthalten ist.",
    ],
    extras: ["Privatumzug inklusive Montage", "Möbeltransport einzelner Stücke"],
    area:
      "Möbelmontagen übernehmen wir in Graz, Graz-Umgebung und der Steiermark, meist in Verbindung mit einem Umzug oder Möbeltransport.",
    faqs: [
      { q: "Montieren Sie auch Möbel, die nicht bei Ihnen transportiert wurden?", a: "Ja, nach Absprache. Nennen Sie uns die Möbel und schicken Sie am besten Fotos oder den Modellnamen." },
      { q: "Was ist mit Einbauküchen?", a: "Küchenmontage mit Anschlüssen für Wasser, Strom oder Gas ist eine Fachleistung. Sprechen Sie uns an, wir sagen Ihnen offen, welche Teile wir übernehmen und wofür Sie eine Fachfirma brauchen." },
      { q: "Was passiert mit Schrauben und Kleinteilen?", a: "Wir sammeln sie beim Abbau pro Möbelstück, beschriften sie und bauen sie am neuen Ort wieder ein." },
      { q: "Bauen Sie auch Wandregale oder Hängeschränke an?", a: "Das klären wir im Einzelfall, je nach Wandbeschaffenheit und Freigabe durch Eigentümer oder Hausverwaltung." },
    ],
    cta: "Montage anfragen",
    posts: ["moebelmontage-umzug", "moebel-umzug-vorbereiten"],
    related: ["privatumzug-graz", "moebeltransport-graz", "firmenumzug-graz"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
