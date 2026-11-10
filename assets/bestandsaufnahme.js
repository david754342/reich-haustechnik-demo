/*!
 * Reich Haustechnik – Bestandsaufnahme (Bad, Heizung, Klimaanlage, Sanitär)
 * Mehrstufiges Formular, Aufbau angelehnt an die Zoho-Vorlage „Bestandsaufnahme Heizung“.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * Versand
   *   provider: 'web3forms'  – E-Mail über web3forms.com (Access Key nötig)
   *             'formsubmit' – E-Mail über formsubmit.co (formsubmitTo = Empfänger)
   *             'demo'       – nichts senden, nur Danke-Meldung zeigen
   *
   *   >>> Hier den Web3Forms Access Key eintragen (von web3forms.com per Mail): <<<
   * ------------------------------------------------------------------ */
  var SEND = {
    provider: 'web3forms',
    web3formsKey: 'HIER-ACCESS-KEY-EINTRAGEN',
    formsubmitTo: ''
  };
  // Fotos als Dateianhang mitsenden? Nur mit Web3Forms-Pro möglich – sonst Foto-Checkliste.
  var ATTACHMENTS = false;

  var PHONE = '07633 93 43 40';
  var PHONE_TEL = '+497633934340';
  var WHATSAPP = 'https://wa.link/oufanb';
  var PHOTO_MAIL = 'info@reich-sanitaer.de';
  var MAX_FILES_PER_FIELD = 5;
  var MAX_TOTAL_MB = 20;
  var IMG_MAX_EDGE = 1600;
  var IMG_QUALITY = 0.8;

  var root = document.querySelector('.rb-ba[data-topic]');
  if (!root) return;
  var topicKey = root.getAttribute('data-topic');
  var base = root.getAttribute('data-base') || './';
  var STORE_KEY = 'reich-bestandsaufnahme-' + topicKey;

  /* ---------------------------- Icons ------------------------------- */
  var HOUSE = '<path d="M8 27 32 9l24 18"/><path d="M14 23v23h36V23"/><path d="M4 46h56"/>';
  function boiler(x, y, w, h) { return '<rect class="h" x="' + x + '" y="' + y + '" width="' + (w || 8) + '" height="' + (h || 10) + '" rx="1.5"/>'; }
  function unit(x, y) { return '<rect class="a" x="' + x + '" y="' + y + '" width="16" height="12" rx="2"/><rect x="' + x + '" y="' + y + '" width="16" height="12" rx="2"/><circle cx="' + (x + 6) + '" cy="' + (y + 6) + '" r="3.5"/><path d="M' + (x + 12) + ' ' + (y + 3) + 'v6"/>'; }
  var ICONS = {
    keller: '<rect class="a" x="14" y="46" width="36" height="13"/>' + HOUSE + '<path d="M14 46v13h36V46" stroke-dasharray="3 3"/><rect x="20" y="29" width="8" height="7"/><path d="M36 46V34h7v12"/>' + boiler(28, 48),
    dach: '<path class="a" d="M17 24 32 12.5 47 24z"/>' + HOUSE + '<rect x="20" y="31" width="8" height="7"/><path d="M36 46V34h7v12"/>' + boiler(28, 16, 8, 7),
    etage: '<rect class="a" x="14" y="24" width="36" height="11"/><rect class="a" x="14" y="35" width="36" height="11"/>' + HOUSE + '<path d="M14 35h36"/>' + boiler(19, 26, 6, 7) + boiler(19, 37, 6, 7) + '<rect x="33" y="27" width="10" height="5"/><rect x="33" y="38" width="10" height="5"/>',
    eg: '<rect class="a" x="14" y="33" width="36" height="13"/>' + HOUSE + '<path d="M14 33h36"/><path d="M8 50h48" stroke-dasharray="2 4"/>' + boiler(38, 35) + '<rect x="20" y="26" width="8" height="5"/>',
    'abgas-aussen': HOUSE + '<path class="a" d="M50 38h6V6h-4v32z"/><path d="M50 40h6V6"/><path d="M52 6h8"/><path d="M58 2c-2 0-2 0 0 0"/>' + boiler(38, 34) + '<rect x="20" y="29" width="8" height="7"/>',
    'abgas-kamin': '<rect class="a" x="34" y="4" width="7" height="42"/>' + HOUSE + '<path d="M34 46V4h7v42"/><path d="M33 4h9"/>' + boiler(22, 36) + '<path d="M30 41h4"/>',
    wp: '<rect class="a" x="8" y="16" width="48" height="32" rx="4"/><rect x="8" y="16" width="48" height="32" rx="4"/><circle cx="24" cy="32" r="10"/><path d="M24 23c3 4 3 6 0 9M24 41c-3-4-3-6 0-9M15 32c4-3 6-3 9 0M33 32c-4 3-6 3-9 0"/><path d="M40 24h10M40 30h10M40 36h10M40 42h10"/><path d="M14 48v4M50 48v4"/>',
    holz: '<path class="a" d="M32 6c6 8 12 12 12 20a12 12 0 0 1-24 0c0-5 3-8 5-11 1 4 3 6 5 6-2-5-1-10 2-15z"/><path d="M32 6c6 8 12 12 12 20a12 12 0 0 1-24 0c0-5 3-8 5-11 1 4 3 6 5 6-2-5-1-10 2-15z"/><path d="M8 44 56 56M56 44 8 56"/>',
    wunsch: '<path class="a" d="M24 42c0-7-9-10-9-21a17 17 0 0 1 34 0c0 11-9 14-9 21z"/><path d="M24 42c0-7-9-10-9-21a17 17 0 0 1 34 0c0 11-9 14-9 21z"/><path d="M25 48h14M27 54h10M32 30v-8M28 24l4-4 4 4"/>',
    wanne: '<path class="a" d="M6 32h52v6a12 12 0 0 1-12 12H18A12 12 0 0 1 6 38z"/><path d="M6 32h52v6a12 12 0 0 1-12 12H18A12 12 0 0 1 6 38z"/><path d="M4 32h56M16 50l-3 6M48 50l3 6M14 32V14a5 5 0 0 1 10 0v2M21 20h6"/>',
    dusche: '<path class="a" d="M30 18h18l-3 6H33z"/><path d="M14 58V14a6 6 0 0 1 6-6h13a6 6 0 0 1 6 6v4M30 18h18l-3 6H33z"/><path d="M35 30l-1 5M40 30v5M45 30l1 5M37 40l-1 5M43 40l1 5M8 58h48"/>',
    wc: '<rect class="a" x="14" y="8" width="18" height="18" rx="2"/><rect x="14" y="8" width="18" height="18" rx="2"/><path d="M10 30h40M12 30c0 9 6 15 14 16v10h12V44c7-3 12-8 12-14"/><path d="M22 14h6"/>',
    waschtisch: '<path class="a" d="M10 34h44l-4 10H14z"/><rect x="20" y="6" width="24" height="18" rx="3"/><path d="M10 34h44l-4 10H14zM32 34v-6h6M18 44v12h28V44M32 48v4"/>',
    komplett: '<rect class="a" x="8" y="8" width="48" height="48" rx="3"/><rect x="8" y="8" width="48" height="48" rx="3"/><path d="M8 24h48M8 40h48M24 8v48M40 8v48"/>',
    teil: '<path class="a" d="M8 32h48v21a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3z"/><rect x="8" y="8" width="48" height="48" rx="3"/><path d="M8 32h48M8 44h48M24 32v24M40 32v24"/>',
    barrierefrei: '<circle class="a" cx="30" cy="11" r="5"/><circle cx="30" cy="11" r="5"/><path d="M30 18v14h12l5 13M30 25h10"/><path d="M24 28a14 14 0 1 0 18 18"/><path d="M6 58h52"/>',
    'wanne-dusche': '<path class="a" d="M4 36h22v4a8 8 0 0 1-8 8h-6a8 8 0 0 1-8-8z"/><path d="M4 36h22v4a8 8 0 0 1-8 8h-6a8 8 0 0 1-8-8zM28 30h8M33 26l4 4-4 4"/><path d="M44 56V20a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2M52 22h10l-2 4h-6zM55 32v3M59 32v3M40 56h22"/>',
    fassade: '<g transform="translate(-6 0)">' + HOUSE + '<rect x="20" y="29" width="8" height="7"/><path d="M36 46V34h7v12"/></g>' + unit(46, 18) + '<path d="M44 38l10-8M44 30h2"/>',
    boden: '<g transform="translate(-8 0)">' + HOUSE + '<rect x="20" y="29" width="8" height="7"/><path d="M36 46V34h7v12"/></g>' + unit(46, 34) + '<path d="M46 46h16"/>',
    flachdach: '<rect class="a" x="22" y="12" width="16" height="10" rx="2"/><path d="M8 24h48v22H8zM4 46h56M6 24h52"/><rect x="22" y="12" width="16" height="10" rx="2"/><circle cx="28" cy="17" r="3"/><rect x="14" y="30" width="8" height="7"/><rect x="28" y="30" width="8" height="7"/><rect x="42" y="30" width="8" height="7"/>',
    balkon: '<path d="M10 6v52M54 6v52M4 58h56M10 30h44"/><path d="M14 44h40M14 44v-14M24 44V30M34 44V30M44 44V30"/>' + unit(28, 16) + '<rect x="16" y="10" width="8" height="14"/>',
    wandgeraet: '<rect class="a" x="6" y="12" width="52" height="16" rx="4"/><rect x="6" y="12" width="52" height="16" rx="4"/><path d="M12 24h40M48 17h4"/><path d="M14 38c4 3 8 3 12 0s8-3 12 0 8 3 12 0M14 48c4 3 8 3 12 0s8-3 12 0 8 3 12 0"/>',
    truhe: '<rect class="a" x="12" y="24" width="40" height="28" rx="4"/><rect x="12" y="24" width="40" height="28" rx="4"/><path d="M18 30h28M18 34h28M6 56h52M20 18c3-3 3-6 0-9M32 18c3-3 3-6 0-9M44 18c3-3 3-6 0-9"/>',
    kassette: '<path d="M4 8h56"/><path class="a" d="M14 8h36v10H14z"/><path d="M14 8h36v10H14zM20 13h8M36 13h8"/><path d="M18 26l-6 10M32 26v12M46 26l6 10M14 44l-4 8M32 44v10M50 44l4 8"/>',
    beratung: '<path class="a" d="M8 10h48v32H28l-12 10V42H8z"/><path d="M8 10h48v32H28l-12 10V42H8z"/><path d="M27 21a5 5 0 1 1 7 4.6c-1.4.6-2 1.6-2 3V30M32 35v1"/>',
    trinkwasser: '<path class="a" d="M32 6c8 12 14 19 14 27a14 14 0 0 1-28 0c0-8 6-15 14-27z"/><path d="M32 6c8 12 14 19 14 27a14 14 0 0 1-28 0c0-8 6-15 14-27z"/><path d="M25 34a7 7 0 0 0 7 7M4 54h56M4 60h56"/>',
    hebeanlage: '<rect class="a" x="10" y="30" width="36" height="24" rx="3"/><rect x="10" y="30" width="36" height="24" rx="3"/><path d="M14 42c3 2 6 2 9 0s6-2 9 0 6 2 9 0M38 30V8h14M46 2l6 6-6 6M4 54h56"/>',
    hauswasser: '<path d="M4 14h56M4 22h56"/><path class="a" d="M24 24h16v26a8 8 0 0 1-16 0z"/><path d="M24 22v28a8 8 0 0 0 16 0V22"/><circle cx="12" cy="34" r="6"/><path d="M12 34l3-3M12 22v6M30 34h4M30 40h4"/>',
    rohrbruch: '<path d="M4 18h22M4 30h20M38 18h22M40 30h20M26 18l3 5-3 3 2 4M38 18l-3 5 3 3-2 4"/><path class="a" d="M32 38c3 5 5 8 5 11a5 5 0 0 1-10 0c0-3 2-6 5-11z"/><path d="M32 38c3 5 5 8 5 11a5 5 0 0 1-10 0c0-3 2-6 5-11zM18 44l-2 5M46 44l2 5M4 60h56"/>'
  };
  function icon(key) {
    return '<svg class="rb-ba__icon" viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[key] || '') + '</svg>';
  }

  /* -------------------------- Bausteine ----------------------------- */
  var YEAR = new Date().getFullYear();
  function intro() {
    return { type: 'html', cls: 'rb-ba__intro', html:
      '<p>Wir bitten Sie, folgende Fragen auszufüllen, damit wir bereits im Vorfeld eine genaue Vorstellung Ihrer Wünsche und Bedürfnisse erhalten.</p>' +
      '<p>Auch ermöglichen uns Ihre Angaben, ein individuelles und realistisches Angebot für Sie zu erstellen.</p>' +
      '<p>Falls Sie das Ausfüllen zwischenzeitlich unterbrechen müssen, speichert das Formular Ihren aktuellen Fortschritt automatisch auf diesem Gerät. Sie können jederzeit wieder weitermachen.</p>' +
      '<p>Falls sich beim Ausfüllen Unklarheiten ergeben, kontaktieren Sie uns gerne jederzeit unter <a href="tel:' + PHONE_TEL + '">' + PHONE + '</a>.<br>Wir sind für Sie da.</p>' };
  }
  var OFFER_YES = ['Ja – wir suchen ein Vergleichsangebot', 'Ja – wir sind allerdings noch nicht davon überzeugt'];
  function contact(types) {
    var f = [
      { type: 'name', label: 'Wir freuen uns darauf, Sie kennenzulernen.', required: true },
      { type: 'text', name: 'Straße und Hausnummer', label: 'Straße und Hausnummer', required: true, auto: 'street-address' },
      { type: 'text', name: 'Gebäudestandort (PLZ und Ort)', label: 'Gebäudestandort (PLZ und Ort)', required: true },
      { type: 'tel', name: 'Telefon', label: 'Telefon + ggf. Mobilnummer', required: true, auto: 'tel', half: true },
      { type: 'email', name: 'E-Mail', label: 'E-Mail', required: true, auto: 'email', half: true },
      { type: 'text', name: 'Aufmerksam geworden durch', label: 'Wie sind Sie auf Reich Haustechnik aufmerksam geworden?', required: true },
      { type: 'radio', id: 'angebot', name: 'Angebot vorhanden', label: 'Haben Sie bereits ein Angebot vorliegen?', required: true, stack: true, options: OFFER_YES.concat(['Nein']) },
      ATTACHMENTS
        ? { type: 'file', name: 'Vergleichsangebot', label: 'Bitte laden Sie das Vergleichsangebot hoch', accept: 'image/*,application/pdf', when: { id: 'angebot', in: OFFER_YES } }
        : { type: 'html', cls: 'rb-ba__hint', html: '<p>Gerne prüfen wir Ihr Vergleichsangebot. Wie Sie es uns schicken können, zeigen wir Ihnen in Schritt 4 „Fotos & Unterlagen“.</p>', when: { id: 'angebot', in: OFFER_YES } },
      { type: 'radio', id: 'gebaeude', name: 'Gebäudetyp', label: 'Um welchen Gebäudetyp handelt es sich?', required: true, options: types },
      { type: 'radio', name: 'Reihenhaus', label: 'Unser Reihenhaus ist ein', required: true, options: ['Reihenmittelhaus', 'Reihenendhaus'], when: { id: 'gebaeude', in: ['Reihenhaus'] } },
      { type: 'radio', name: 'Stockwerk der Wohnung', label: 'In welchem Stockwerk liegt die Wohnung?', required: true, compact: true, options: ['UG', 'EG', '1. OG', '2. OG', '3. OG', 'höher'], when: { id: 'gebaeude', in: ['Wohnung'] } },
      { type: 'radio', name: 'Aufzug vorhanden', label: 'Gibt es einen Aufzug?', options: ['Ja', 'Nein'], when: { id: 'gebaeude', in: ['Wohnung'] } },
      { type: 'radio', name: 'Etagen', label: 'Wie viele Etagen hat das Gebäude mit dem Kellergeschoss und dem Dachgeschoss?', required: true, compact: true, options: ['1', '2', '3', '4', '5', '6', '7', '8'] },
      { type: 'radio', name: 'Wohneinheiten', label: 'Wie viele Wohneinheiten gibt es in diesem Haus?', required: true, compact: true, options: ['1', '2', '3', '4', '5', '6', '7', '8', 'Mehr'], when: { id: 'gebaeude', in: ['Mehrfamilienhaus'] } }
    ];
    return f;
  }
  function importance(rows) {
    return { type: 'matrix', name: 'Wie wichtig', label: 'Wie wichtig sind Ihnen …', required: true, rows: rows, cols: ['Weniger wichtig', 'wichtig', 'sehr wichtig'] };
  }
  var PV_PHOTOS = [{ label: 'Batteriespeicher', when: { id: 'akku', in: ['Ja'] } }, { label: 'Wechselrichter', when: { id: 'pv', in: ['Schon vorhanden'] } }];
  var BUILT = { type: 'radio', name: 'Baujahr Gebäude (Zeitraum)', label: 'Wann wurde das Gebäude erbaut?', options: ['vor 1990', 'zwischen 1991 und 2000', 'zwischen 2001 und 2009', 'nach 2009'] };
  var BUILT_EXACT = { type: 'number', name: 'Baujahr Gebäude', label: 'Genaues Baujahr Gebäude', required: true, min: 1500, max: YEAR + 1, placeholder: 'z. B. 1985', half: true };
  var INSULATION = { type: 'checkbox', name: 'Wärmeschutz', label: 'Wurden nachträglich Maßnahmen für den Wärmeschutz getroffen?', required: true, options: ['Neue Fenster', 'Außenfassade gedämmt', 'Dach nachträglich isoliert', 'Bisher noch keine'] };
  var PLANNED = { type: 'text', name: 'Weitere Sanierungen geplant', label: 'Sind derzeit weitere Sanierungsarbeiten an Ihrem Gebäude geplant? Wenn ja, welche?', required: true, placeholder: 'z. B. „Nein“ oder „Fenstertausch 2027“' };
  var SPECIAL = function (help) { return { type: 'text', name: 'Besonderheiten', label: 'Gibt es etwas, worauf wir besonders achten müssen?', help: help }; };
  var WHEN_START = { type: 'radio', name: 'Wunschtermin', label: 'Wann möchten Sie das Projekt umsetzen?', stack: true, options: ['So schnell wie möglich', 'In den nächsten 3–6 Monaten', 'In 6–12 Monaten', 'Noch offen'] };
  var UPLOAD_TITLE = ATTACHMENTS ? 'Daten-Upload' : 'Fotos & Unterlagen';
  function uploadIntro(extra) {
    if (ATTACHMENTS) {
      return [
        { type: 'html', cls: 'rb-ba__lead', html: '<h4>Foto-Upload</h4><p>Anhand der Bilder können wir die Ist-Situation optimal einschätzen und so den Projektumfang sehr genau bestimmen.' + (extra ? ' ' + extra : '') + '</p>' },
        { type: 'section', title: 'Hinweis', text: 'Bitte laden Sie pro Uploadfeld bis zu ' + MAX_FILES_PER_FIELD + ' Bilder hoch. Fotos werden vor dem Senden automatisch verkleinert. Alle Uploads zusammen dürfen ' + MAX_TOTAL_MB + ' MB nicht überschreiten. Am Handy können Sie direkt die Kamera verwenden.' }
      ];
    }
    return [
      { type: 'html', cls: 'rb-ba__lead', html: '<h4>Fotos</h4><p>Anhand der Bilder können wir die Ist-Situation optimal einschätzen und so den Projektumfang sehr genau bestimmen.' + (extra ? ' ' + extra : '') + '</p>' },
      { type: 'section', title: 'So geht’s', text: 'Machen Sie die Fotos aus der Liste am besten direkt mit dem Handy und schicken Sie sie uns per WhatsApp oder E-Mail. Nennen Sie dabei bitte Ihren Namen, damit wir die Bilder Ihrer Bestandsaufnahme zuordnen können.' }
    ];
  }
  function files(list) {
    var items = list.map(function (x) { return typeof x === 'string' ? { label: x } : x; });
    if (ATTACHMENTS) {
      return items.map(function (o) {
        return { type: 'file', name: 'Foto: ' + o.label, label: o.label, accept: o.accept || 'image/*', help: o.help, when: o.when };
      });
    }
    items.unshift({ label: 'Ihr Vergleichsangebot', help: 'als Foto oder PDF', when: { id: 'angebot', in: OFFER_YES } });
    return [
      { type: 'photolist', label: 'Diese Fotos helfen uns besonders:', items: items },
      { type: 'html', cls: 'rb-ba__send-photos', html:
        '<a class="rb-ba__btn rb-ba__btn--wa" href="' + WHATSAPP + '" target="_blank" rel="noopener">' +
        '<svg viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>Fotos per WhatsApp senden</a>' +
        '<a class="rb-ba__btn rb-ba__btn--ghost" href="mailto:' + PHOTO_MAIL + '" data-photo-mail>' +
        '<svg viewBox="0 0 512 512" aria-hidden="true"><path fill="currentColor" d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/></svg>Fotos per E-Mail senden</a>' },
      { type: 'radio', name: 'Fotos kommen per', label: 'Wie möchten Sie uns die Fotos zukommen lassen?', required: true, options: ['Per WhatsApp', 'Per E-Mail', 'Beim Vor-Ort-Termin'] }
    ];
  }
  function finalPage() {
    return { title: 'Ihr Projekt – Unsere Mission', fields: [
      { type: 'textarea', name: 'Weitere Mitteilungen', label: 'Haben wir etwas vergessen? Hier ist noch Platz für weitere Mitteilungen an uns:' },
      { type: 'html', cls: 'rb-ba__thanks', html: '<p><strong>Vielen Dank für Ihre Angaben.</strong> Nun arbeiten wir für Sie und erstellen Ihr individuelles Angebot.</p><p>Wir freuen uns auf das Kennenlernen und melden uns schnellstmöglich zurück.</p>' },
      { type: 'consent', name: 'Datenschutz', required: true }
    ] };
  }

  /* ----------------------------- Themen ----------------------------- */
  var TOPICS = {
    heizung: {
      title: 'Bestandsaufnahme Ihrer bestehenden Heizung',
      subject: 'Bestandsaufnahme Heizung',
      pages: [
        { title: 'Allgemeine Informationen', fields: [intro()].concat(contact(['Einfamilienhaus', 'Mehrfamilienhaus', 'Reihenhaus'])).concat([
          importance(['Maximale Fördermöglichkeiten', 'Langfristig niedrige Energiekosten', 'Einfache Steuerung', 'Langlebigkeit der Anlage', 'Möglichst niedrige Investition', 'Ein Ansprechpartner für alle anfallenden Gewerke', 'Nachhaltige Wärmequellen']),
          { type: 'checkbox', id: 'heizart', name: 'Heizart derzeit', label: 'Wie heizen Sie derzeit?', required: true, options: ['Öl', 'Gas', 'Holz', 'Strom', 'Solaranlage für Trinkwasser', 'Solaranlage als Heizungsunterstützung', 'Wärmepumpe', 'Nah-/Fernwärme'] },
          { type: 'image', name: 'Standort der Heizung', label: 'Wo befindet sich die Heizung?', required: true, options: [['In einem Heizraum im Keller', 'keller'], ['Unter dem Dach', 'dach'], ['Auf der jeweiligen Etage', 'etage'], ['Kein Keller. Die Anlage ist im Erdgeschoss im Hausanschlussraum.', 'eg']] },
          { type: 'image', name: 'Abgasführung', label: 'Wie verläuft die Abgasführung?', options: [['Außen am Gebäude', 'abgas-aussen'], ['Durch einen Kamin im Haus', 'abgas-kamin']] },
          SPECIAL('Falls Sie eine besondere Abgasführung haben, notieren Sie dies bitte hier kurz.'),
          { type: 'radio', name: 'Weiterer Wärmeerzeuger am Kamin', label: 'Ist am Kamin der Zentralheizung noch ein weiterer Wärmeerzeuger angeschlossen?', options: ['Ja', 'Nein'] },
          { type: 'checkbox', name: 'Heizsystem', label: 'Wie heizen Sie derzeit? (Mehrfachauswahl möglich)', options: ['Zentralheizung', 'Zusätzliche Wärmeerzeuger, z. B. Kachelofen / Kaminofen'] },
          { type: 'radio', id: 'verteilung', name: 'Wärmeverteilung', label: 'Wie erfolgt die Wärmeverteilung?', required: true, stack: true, options: ['Heizkörper', 'Fußbodenheizung', 'Kombination Fußbodenheizung + Heizkörper', 'Sonstige'] },
          { type: 'radio', name: 'Anteil Fußbodenheizung', label: 'Wie hoch ist der Anteil der Fußbodenheizung?', required: true, stack: true, options: ['Überwiegend Heizkörper, wenig Fußbodenheizung', 'Ausgeglichen', 'Wenig Heizkörper, überwiegend Fußbodenheizung', 'Sonstige'], when: { id: 'verteilung', in: ['Kombination Fußbodenheizung + Heizkörper'] } },
          { type: 'checkbox', name: 'Warmwasser', label: 'Wie erfolgt derzeit die Versorgung mit Warmwasser?', required: true, stack: true, options: ['Durch einen an die Heizung angeschlossenen Speicher', 'Etagenweise mit Durchlauferhitzer', 'Mit einem zusätzlichen Warmwasserspeicher, der über Strom oder eine Wärmepumpe betrieben wird', 'Solaranlage für Trinkwasser', 'Keine Warmwassererzeugung über die Zentralheizung'] },
          { type: 'radio', name: 'Wasserabfluss im Heizraum', label: 'Befindet sich im Heizungsraum ein Wasserabfluss?', required: true, stack: true, options: ['Ja – mit einem festen Abwasseranschluss', 'Ja – ein Bodenablauf', 'Nein'] }
        ]) },
        { title: 'Ihr Gebäude', fields: [
          { type: 'section', title: 'Detailangaben zum Haus' },
          BUILT, BUILT_EXACT,
          { type: 'number', name: 'Baujahr Heizungsanlage', label: 'Genaues Baujahr Ihrer Heizungsanlage', required: true, min: 1950, max: YEAR + 1, placeholder: 'z. B. 2004', half: true },
          { type: 'triple', name: 'Energieverbrauch', label: 'Wie hoch war der Energieverbrauch in den letzten 3 Jahren? (z. B. Liter Öl, kWh Strom, m³ Gas)', required: true },
          { type: 'triple', name: 'Haushaltsstromverbrauch', label: 'Wie hoch war der Haushaltsstromverbrauch in den letzten 3 Jahren? (jährliche Angabe in kWh)', required: true },
          INSULATION, PLANNED
        ] },
        { title: 'Ihre Heizung', fields: [
          { type: 'section', title: 'Ihre Wünsche stehen bei uns im Mittelpunkt', text: 'Ihr neues Energiesystem ist individuell und muss bestmöglich zu Ihnen und Ihrem Zuhause passen.' },
          { type: 'number', name: 'Wohnfläche (m²)', label: 'Wie groß ist das Haus? Angabe in Quadratmetern', required: true, unit: 'm²', min: 10, max: 5000, half: true },
          { type: 'number', name: 'Personen im Haus', label: 'Wie viele Personen wohnen in dem Haus?', required: true, min: 1, max: 99, half: true },
          { type: 'section', title: 'Ihr neues Heizsystem', text: '<strong>Machen Sie Ihre neue Heizung enkeltauglich!</strong> Weiter geht es mit Ihren Wünschen und Vorstellungen für Ihr neues und individuelles Heizsystem.' },
          { type: 'image', name: 'Heizen in Zukunft', label: 'Wie wollen Sie in Zukunft heizen?', required: true, options: [['Strom (Wärmepumpe)', 'wp'], ['Holz (Pellet, Stückholz)', 'holz'], ['Individueller Wunsch', 'wunsch']] },
          { type: 'text', name: 'Individueller Wunsch', label: 'Falls Sie einen individuellen Wunsch haben, können Sie diesen hier eingeben' },
          { type: 'html', cls: 'rb-ba__lead', html: '<p>Besteht Interesse an einer Solaranlage? (Für die Gewinnung von Strom oder für die Warmwasserbereitung/Heizung)</p>' },
          { type: 'radio', id: 'solar', name: 'Solarthermie', label: 'Ist das Thema Solarthermie für Sie interessant?', required: true, stack: true, options: ['Solar? Na klar!', 'Ja – sofern es nicht zu teuer ist', 'Nein – auf keinen Fall', 'Schon vorhanden'] },
          { type: 'number', name: 'Größe Solaranlage (m²)', label: 'Nutzen Sie bereits die Vorzüge einer bestehenden Solaranlage? Bitte teilen Sie uns die Größe der Anlage mit.', unit: 'm²', half: true, when: { id: 'solar', in: ['Schon vorhanden'] } },
          { type: 'radio', id: 'pv', name: 'Photovoltaik', label: 'Ist das Thema Photovoltaik für Sie von Interesse?', required: true, stack: true, options: ['PV? Na klar!', 'Ja – sofern es nicht zu teuer ist', 'Nein – nicht wirklich', 'Schon vorhanden'] },
          { type: 'number', name: 'PV-Anlage (kWp)', label: 'Wie groß ist Ihre Photovoltaikanlage?', unit: 'kWp', required: true, half: true, step: 'any', when: { id: 'pv', in: ['Schon vorhanden'] } },
          { type: 'number', name: 'PV-Installationsjahr', label: 'Installationsjahr der bestehenden PV-Anlage', required: true, min: 1990, max: YEAR + 1, half: true, when: { id: 'pv', in: ['Schon vorhanden'] } },
          { type: 'radio', id: 'akku', name: 'Batteriespeicher vorhanden', label: 'Ist ein Batteriespeicher bereits vorhanden?', required: true, options: ['Ja', 'Noch nicht'], when: { id: 'pv', in: ['Schon vorhanden'] } },
          { type: 'number', name: 'Batteriespeicher (kWh)', label: 'Wie groß ist Ihr Batteriespeicher?', unit: 'kWh', required: true, half: true, step: 'any', when: { id: 'akku', in: ['Ja'] } }
        ].concat(ATTACHMENTS ? files(PV_PHOTOS) : []) },
        { title: UPLOAD_TITLE, fields: [
          { type: 'radio', name: 'Beschaffenheit Öltank', label: 'Wie ist die Beschaffenheit Ihres Öltanks?', options: ['Kellergeschweißter Öltank', 'Batterietank-Anlage'], when: { id: 'heizart', has: 'Öl' } },
          { type: 'number', name: 'Öltank (Liter)', label: 'Wie viel Liter fasst die Öltankanlage?', unit: 'Liter', half: true, when: { id: 'heizart', has: 'Öl' } }
        ].concat(uploadIntro('Dies ist vor allem wichtig, um die maximale staatliche Förderung für Sie zu erarbeiten.')).concat(files([
          { label: 'Der Grundriss Ihres Hauses', accept: 'image/*,application/pdf' },
          'Haus von außen', 'Fotos der jetzigen Heizungsanlage', 'Typenschild der Heizung', 'Heizungspumpen', 'Nahaufnahme der Anlagenteile',
          'Bilder der aktuellen Heizkörper', 'Warmwasserbereitung', 'Wasserzähler', 'Hauswasseranschluss und Wasserverteilung',
          { label: 'Öltank / Öltankraum', when: { id: 'heizart', has: 'Öl' } },
          'Stromzählerkasten', 'Weg in den Heizraum'
        ].concat(ATTACHMENTS ? [] : PV_PHOTOS))) },
        finalPage()
      ]
    },

    bad: {
      title: 'Bestandsaufnahme Ihres bestehenden Badezimmers',
      subject: 'Bestandsaufnahme Bad',
      pages: [
        { title: 'Allgemeine Informationen', fields: [intro()].concat(contact(['Einfamilienhaus', 'Mehrfamilienhaus', 'Reihenhaus', 'Wohnung'])).concat([
          importance(['Barrierefreiheit / bodengleiche Dusche', 'Pflegeleichte Oberflächen', 'Modernes Design', 'Langlebigkeit der Materialien', 'Möglichst niedrige Investition', 'Kurze Bauzeit', 'Ein Ansprechpartner für alle anfallenden Gewerke']),
          { type: 'image', name: 'Art des Raumes', label: 'Um welchen Raum handelt es sich?', required: true, options: [['Badezimmer mit Wanne', 'wanne'], ['Duschbad', 'dusche'], ['Gäste-WC', 'wc'], ['Zweitbad / Kinderbad', 'waschtisch']] },
          { type: 'radio', name: 'Lage des Bades', label: 'In welchem Geschoss befindet sich das Bad?', required: true, options: ['Keller / UG', 'Erdgeschoss', 'Obergeschoss', 'Dachgeschoss'] },
          { type: 'checkbox', name: 'Aktuelle Ausstattung', label: 'Was ist aktuell im Bad vorhanden?', required: true, options: ['Badewanne', 'Dusche mit Duschwanne', 'Bodengleiche Dusche', 'Waschtisch', 'Doppelwaschtisch', 'Stand-WC', 'Wand-WC', 'Bidet / Urinal', 'Fenster', 'Heizkörper', 'Fußbodenheizung', 'Lüftung / Ventilator'] },
          { type: 'radio', name: 'Warmwasser im Bad', label: 'Wie wird das Warmwasser im Bad bereitgestellt?', required: true, stack: true, options: ['Zentral über die Heizung', 'Elektrischer Durchlauferhitzer', 'Elektro-Boiler / Untertischspeicher', 'Weiß ich nicht'] },
          { type: 'checkbox', name: 'Wände und Boden', label: 'Wie sind Wände und Boden aktuell gestaltet?', required: true, options: ['Wände komplett gefliest', 'Wände teilweise gefliest', 'Boden gefliest', 'Andere Beläge (z. B. PVC, Putz, Holz)'] },
          SPECIAL('z. B. enge Treppen, Zugang zum Bad, Leitungen in der Wand, Denkmalschutz')
        ]) },
        { title: 'Ihr Gebäude', fields: [
          { type: 'section', title: 'Detailangaben zum Haus und zum Bad' },
          BUILT, BUILT_EXACT,
          { type: 'radio', name: 'Letzte Renovierung', label: 'Wann wurde das Bad zuletzt renoviert?', required: true, stack: true, options: ['Noch nie (Originalzustand)', 'Vor mehr als 20 Jahren', 'Vor 10–20 Jahren', 'Vor weniger als 10 Jahren'] },
          { type: 'number', name: 'Raumlänge (m)', label: 'Länge des Raumes', unit: 'm', required: true, step: 'any', min: 0.5, max: 30, half: true },
          { type: 'number', name: 'Raumbreite (m)', label: 'Breite des Raumes', unit: 'm', required: true, step: 'any', min: 0.5, max: 30, half: true },
          { type: 'number', name: 'Raumhöhe (m)', label: 'Raumhöhe (falls bekannt)', unit: 'm', step: 'any', min: 1.5, max: 6, half: true },
          { type: 'radio', name: 'Wasserleitungen', label: 'Woraus bestehen die Wasserleitungen?', options: ['Verzinkter Stahl', 'Kupfer', 'Kunststoff / Verbundrohr', 'Weiß ich nicht'] },
          { type: 'radio', name: 'Während Umbau bewohnt', label: 'Wird das Haus bzw. die Wohnung während des Umbaus bewohnt?', required: true, options: ['Ja', 'Nein'] },
          { type: 'radio', name: 'Ausweich-Bad vorhanden', label: 'Gibt es während der Bauphase ein weiteres Bad oder WC?', required: true, options: ['Ja', 'Nein'] },
          PLANNED
        ] },
        { title: 'Ihr neues Bad', fields: [
          { type: 'section', title: 'Ihre Wünsche stehen bei uns im Mittelpunkt', text: 'Ihr neues Bad ist individuell und muss bestmöglich zu Ihnen und Ihrem Alltag passen.' },
          { type: 'number', name: 'Personen, die das Bad nutzen', label: 'Wie viele Personen nutzen das Bad?', required: true, min: 1, max: 30, half: true },
          { type: 'image', id: 'umfang', name: 'Umfang', label: 'Welcher Umfang ist geplant?', required: true, options: [['Komplettsanierung', 'komplett'], ['Teilsanierung', 'teil'], ['Barrierefreier Umbau', 'barrierefrei'], ['Wanne gegen Dusche tauschen', 'wanne-dusche']] },
          { type: 'checkbox', name: 'Gewünschte Ausstattung', label: 'Welche Ausstattung wünschen Sie sich?', options: ['Bodengleiche Dusche', 'Badewanne', 'Freistehende Badewanne', 'Dusch-WC', 'Wand-WC', 'Doppelwaschtisch', 'LED-Spiegel / Spiegelschrank', 'Handtuchheizkörper', 'Fußbodenheizung', 'Viel Stauraum'] },
          { type: 'radio', name: 'Stil', label: 'Welcher Stil gefällt Ihnen?', options: ['Modern & puristisch', 'Natürlich & warm', 'Klassisch & zeitlos', 'Noch offen'] },
          { type: 'radio', name: 'Budget', label: 'Haben Sie bereits ein Budget eingeplant?', stack: true, options: ['Bis 15.000 €', '15.000 – 25.000 €', '25.000 – 40.000 €', 'Über 40.000 €', 'Noch offen'] },
          WHEN_START,
          { type: 'radio', name: 'Ausstellungsbesuch', label: 'Möchten Sie sich in einer Ausstellung unserer Partner inspirieren lassen?', options: ['Ja, gerne', 'Nein, danke'] }
        ] },
        { title: UPLOAD_TITLE, fields: uploadIntro('So können wir Ihr neues Bad schon vor dem Termin vor Ort genau planen.').concat(files([
          { label: 'Grundriss oder Skizze des Bades', accept: 'image/*,application/pdf' },
          'Gesamtansicht des Bades', 'Fotos aller Wände', 'Boden', 'Fenster und Tür',
          'Vorhandene Wanne / Dusche', 'WC und Waschtisch', 'Heizkörper', 'Anschlüsse und Revisionsöffnungen',
          { label: 'Inspiration / Wunschbilder', help: 'Gerne auch Screenshots aus Katalogen oder dem Internet.' }
        ])) },
        finalPage()
      ]
    },

    klima: {
      title: 'Bestandsaufnahme für Ihre Klimaanlage',
      subject: 'Bestandsaufnahme Klimaanlage',
      pages: [
        { title: 'Allgemeine Informationen', fields: [intro()].concat(contact(['Einfamilienhaus', 'Mehrfamilienhaus', 'Reihenhaus', 'Wohnung', 'Büro / Gewerbe'])).concat([
          importance(['Leiser Betrieb', 'Niedrige Stromkosten', 'Heizen in der Übergangszeit', 'Unauffällige Optik', 'Einfache Steuerung (z. B. per App)', 'Möglichst niedrige Investition', 'Ein Ansprechpartner für alle anfallenden Gewerke']),
          { type: 'radio', name: 'Eigentumsverhältnis', label: 'Sind Sie Eigentümer der Immobilie?', required: true, stack: true, options: ['Ja, Eigentümer', 'Eigentümergemeinschaft (WEG)', 'Mieter – die Zustimmung des Vermieters ist nötig'] },
          { type: 'radio', id: 'vorhanden', name: 'Klimaanlage vorhanden', label: 'Ist bereits eine Klimaanlage vorhanden?', required: true, stack: true, options: ['Ja – sie soll ersetzt werden', 'Ja – sie soll erweitert werden', 'Nein'] },
          { type: 'number', name: 'Baujahr bestehende Anlage', label: 'Baujahr der bestehenden Anlage', min: 1980, max: YEAR + 1, half: true, when: { id: 'vorhanden', in: ['Ja – sie soll ersetzt werden', 'Ja – sie soll erweitert werden'] } },
          { type: 'radio', name: 'Anzahl Räume', label: 'Wie viele Räume sollen klimatisiert werden?', required: true, compact: true, options: ['1', '2', '3', '4', '5', 'Mehr'] },
          { type: 'checkbox', name: 'Räume', label: 'Um welche Räume handelt es sich?', required: true, options: ['Schlafzimmer', 'Wohnzimmer', 'Kinderzimmer', 'Arbeitszimmer / Büro', 'Küche', 'Dachgeschoss', 'Gewerbe- / Verkaufsraum', 'Serverraum'] },
          { type: 'checkbox', name: 'Ausrichtung der Räume', label: 'In welche Himmelsrichtung zeigen die Fenster der Räume?', options: ['Süden', 'Westen', 'Osten', 'Norden'] },
          { type: 'image', name: 'Standort Außengerät', label: 'Wo könnte das Außengerät stehen?', required: true, options: [['An der Fassade', 'fassade'], ['Am Boden / auf der Terrasse', 'boden'], ['Auf dem Flachdach', 'flachdach'], ['Auf dem Balkon', 'balkon']] },
          SPECIAL('z. B. Denkmalschutz, Vorgaben der Eigentümergemeinschaft, Lärmschutz zum Nachbarn')
        ]) },
        { title: 'Ihr Gebäude', fields: [
          { type: 'section', title: 'Detailangaben zum Gebäude' },
          BUILT, BUILT_EXACT,
          INSULATION,
          { type: 'checkbox', name: 'Sonnenschutz', label: 'Welcher Sonnenschutz ist vorhanden?', required: true, options: ['Rollläden', 'Außenjalousien / Raffstores', 'Markise', 'Innenliegender Sonnenschutz', 'Keiner'] },
          { type: 'triple', name: 'Raumgröße', label: 'Wie groß sind die zu klimatisierenden Räume? (Angabe in m²)', required: true, labels: ['Raum 1', 'Raum 2', 'Raum 3'], placeholder: 'm²' },
          { type: 'number', name: 'Leitungsweg (m)', label: 'Wie weit ist es ungefähr vom Innengerät zum Außengerät?', unit: 'm', step: 'any', min: 0, max: 100, half: true, help: 'Eine Schätzung genügt.' },
          { type: 'radio', name: 'Platz im Zählerschrank', label: 'Ist im Zählerschrank Platz für eine zusätzliche Absicherung?', required: true, options: ['Ja', 'Nein', 'Weiß ich nicht'] },
          PLANNED
        ] },
        { title: 'Ihre Klimaanlage', fields: [
          { type: 'section', title: 'Ihre Wünsche stehen bei uns im Mittelpunkt', text: 'Ihre neue Klimaanlage ist individuell und muss bestmöglich zu Ihnen und Ihren Räumen passen.' },
          { type: 'number', name: 'Personen im Haushalt', label: 'Wie viele Personen halten sich regelmäßig in den Räumen auf?', required: true, min: 1, max: 999, half: true },
          { type: 'image', name: 'Gerätetyp', label: 'Welcher Gerätetyp gefällt Ihnen?', required: true, options: [['Wandgerät', 'wandgeraet'], ['Truhengerät (am Boden)', 'truhe'], ['Deckenkassette', 'kassette'], ['Bitte beraten Sie mich', 'beratung']] },
          { type: 'radio', name: 'System', label: 'Welches System schwebt Ihnen vor?', required: true, stack: true, options: ['Ein Raum (Single-Split)', 'Mehrere Räume mit einem Außengerät (Multi-Split)', 'Weiß ich nicht – bitte beraten'] },
          { type: 'radio', name: 'Heizfunktion', label: 'Möchten Sie mit der Klimaanlage auch heizen?', required: true, stack: true, options: ['Ja, als Ergänzung zur Heizung', 'Nein, nur kühlen', 'Weiß ich noch nicht'] },
          { type: 'radio', id: 'pv', name: 'Photovoltaik', label: 'Ist eine Photovoltaikanlage vorhanden?', required: true, options: ['Ja', 'Geplant', 'Nein'] },
          { type: 'number', name: 'PV-Anlage (kWp)', label: 'Wie groß ist Ihre Photovoltaikanlage?', unit: 'kWp', step: 'any', half: true, when: { id: 'pv', in: ['Ja'] } },
          WHEN_START
        ] },
        { title: UPLOAD_TITLE, fields: uploadIntro('So können wir Leitungswege und Gerätestandorte schon vorab planen.').concat(files([
          { label: 'Grundriss der Räume', accept: 'image/*,application/pdf' },
          'Haus von außen', 'Räume innen (je Raum)', 'Gewünschte Position des Innengeräts', 'Gewünschte Position des Außengeräts',
          'Fassade / möglicher Leitungsweg', 'Zählerschrank / Sicherungskasten',
          { label: 'Typenschild der bestehenden Anlage', when: { id: 'vorhanden', in: ['Ja – sie soll ersetzt werden', 'Ja – sie soll erweitert werden'] } }
        ])) },
        finalPage()
      ]
    },

    sanitaer: {
      title: 'Bestandsaufnahme Ihrer Sanitärinstallation',
      subject: 'Bestandsaufnahme Sanitär',
      pages: [
        { title: 'Allgemeine Informationen', fields: [intro()].concat(contact(['Einfamilienhaus', 'Mehrfamilienhaus', 'Reihenhaus', 'Wohnung', 'Büro / Gewerbe'])).concat([
          importance(['Trinkwasserhygiene', 'Wasser sparen', 'Langlebigkeit der Leitungen', 'Komfort (Wasserdruck, Warmwasser)', 'Möglichst niedrige Investition', 'Schnelle Umsetzung', 'Ein Ansprechpartner für alle anfallenden Gewerke']),
          { type: 'image', id: 'thema', name: 'Hauptanliegen', label: 'Worum geht es Ihnen hauptsächlich?', required: true, options: [['Trinkwasserschutz & Leitungen', 'trinkwasser'], ['Hebeanlage', 'hebeanlage'], ['Hauswasserstation', 'hauswasser'], ['Rohrbruch / Undichtigkeit', 'rohrbruch']] },
          { type: 'checkbox', name: 'Gewünschte Leistungen', label: 'Welche Leistungen interessieren Sie? (Mehrfachauswahl möglich)', required: true, options: ['Erneuerung der Trinkwasserleitungen', 'Erneuerung der Abwasserleitungen', 'Trinkwasseranalyse / Legionellenprüfung', 'Hauswasserstation / Filter', 'Enthärtungsanlage', 'Hebeanlage – Einbau', 'Hebeanlage – Wartung', 'Austausch von Armaturen', 'Außenwasserhahn / Gartenwasser'] },
          { type: 'checkbox', name: 'Aktuelle Probleme', label: 'Gibt es aktuell Probleme?', required: true, options: ['Braunes oder trübes Wasser', 'Geringer Wasserdruck', 'Kalkablagerungen', 'Feuchte Stellen / Undichtigkeit', 'Geräusche in den Leitungen', 'Abfluss langsam oder verstopft', 'Rückstau bei Starkregen', 'Keine Probleme'] },
          { type: 'radio', name: 'Lage Hausanschluss', label: 'Wo befindet sich der Hausanschluss (Wasserzähler)?', required: true, stack: true, options: ['Im Keller', 'Im Hausanschlussraum im Erdgeschoss', 'Im Schacht außerhalb des Hauses', 'Weiß ich nicht'] },
          SPECIAL('z. B. schwer zugängliche Leitungen, frühere Wasserschäden, Termindruck')
        ]) },
        { title: 'Ihr Gebäude', fields: [
          { type: 'section', title: 'Detailangaben zum Haus' },
          BUILT, BUILT_EXACT,
          { type: 'radio', name: 'Material Wasserleitungen', label: 'Woraus bestehen die Wasserleitungen?', required: true, options: ['Verzinkter Stahl', 'Kupfer', 'Kunststoff / Verbundrohr', 'Blei', 'Weiß ich nicht'] },
          { type: 'radio', name: 'Leitungen zuletzt erneuert', label: 'Wann wurden die Leitungen zuletzt erneuert?', required: true, stack: true, options: ['Noch nie (Originalzustand)', 'Vor mehr als 30 Jahren', 'Vor 10–30 Jahren', 'Vor weniger als 10 Jahren', 'Weiß ich nicht'] },
          { type: 'number', name: 'Anzahl Bäder und WCs', label: 'Wie viele Bäder und WCs gibt es im Gebäude?', required: true, min: 0, max: 99, half: true },
          { type: 'radio', name: 'Warmwasserbereitung', label: 'Wie erfolgt die Warmwasserbereitung?', required: true, stack: true, options: ['Zentral über die Heizung / Speicher', 'Elektrischer Durchlauferhitzer', 'Elektro-Boiler', 'Wärmepumpe', 'Solaranlage'] },
          { type: 'number', name: 'Wasserverbrauch pro Jahr (m³)', label: 'Wie hoch ist Ihr Wasserverbrauch pro Jahr?', unit: 'm³', step: 'any', half: true, help: 'Steht auf Ihrer Wasserabrechnung.' },
          { type: 'radio', name: 'Trinkwasseranalyse vorhanden', label: 'Liegt eine aktuelle Trinkwasseranalyse vor?', options: ['Ja', 'Nein'] },
          PLANNED
        ] },
        { title: 'Ihr Sanitär-Projekt', fields: [
          { type: 'section', title: 'Ihre Wünsche stehen bei uns im Mittelpunkt', text: 'Ihre Sanitärinstallation ist individuell und muss bestmöglich zu Ihnen und Ihrem Gebäude passen.' },
          { type: 'number', name: 'Wohnfläche (m²)', label: 'Wie groß ist das Gebäude? Angabe in Quadratmetern', required: true, unit: 'm²', min: 10, max: 10000, half: true },
          { type: 'number', name: 'Personen im Haushalt', label: 'Wie viele Personen wohnen bzw. arbeiten im Gebäude?', required: true, min: 1, max: 999, half: true },
          { type: 'radio', name: 'Geplanter Umfang', label: 'Welcher Umfang ist geplant?', required: true, stack: true, options: ['Komplette Erneuerung der Installation', 'Teilerneuerung (z. B. einzelne Stränge)', 'Einzelne Maßnahme / Reparatur', 'Bitte beraten Sie mich'] },
          { type: 'radio', name: 'Interesse Wasseraufbereitung', label: 'Besteht Interesse an einer Wasseraufbereitung (Filter, Enthärtung)?', required: true, options: ['Ja, gerne', 'Nein', 'Schon vorhanden'] },
          { type: 'radio', name: 'Interesse Regenwassernutzung', label: 'Ist Regenwassernutzung ein Thema für Sie?', options: ['Ja', 'Nein', 'Schon vorhanden'] },
          WHEN_START
        ] },
        { title: UPLOAD_TITLE, fields: uploadIntro('So können wir Leitungen, Anschlüsse und den Aufwand schon vorab einschätzen.').concat(files([
          { label: 'Grundriss / Leitungsplan', accept: 'image/*,application/pdf' },
          'Hausanschluss und Wasserzähler', 'Sichtbare Leitungen im Keller', 'Warmwasserspeicher / -bereitung', 'Armaturen und Sanitärobjekte',
          'Problemstellen (z. B. Rost, Feuchtigkeit)', 'Abwasser / Hebeanlage', 'Typenschilder vorhandener Geräte'
        ])) },
        finalPage()
      ]
    }
  };

  var T = TOPICS[topicKey];
  if (!T) return;

  /* --------------------------- Rendering ---------------------------- */
  var uid = 0;
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function reqMark(f) { return f.required ? ' <span class="rb-ba__req" aria-hidden="true">*</span>' : ''; }
  function help(f) { return f.help ? '<p class="rb-ba__help">' + esc(f.help) + '</p>' : ''; }
  function attrs(f) {
    var a = ' data-type="' + f.type + '"';
    if (f.id) a += ' data-id="' + f.id + '"';
    if (f.required) a += ' data-required="1"';
    if (f.when) a += " data-when='" + esc(JSON.stringify(f.when)) + "'";
    if (f.half) a += ' data-half="1"';
    return a;
  }
  function optionInputs(f, type, cls) {
    var gid = 'rbf' + (++uid);
    return f.options.map(function (o, i) {
      var id = gid + '-' + i;
      return '<label class="' + cls + '" for="' + id + '"><input type="' + type + '" id="' + id + '" ' +
        (type === 'radio' ? 'name="' + esc(f.name) + '"' : 'data-group="' + esc(f.name) + '"') +
        ' value="' + esc(o) + '"><span class="rb-ba__mark" aria-hidden="true"></span><span class="rb-ba__opt-text">' + esc(o) + '</span></label>';
    }).join('');
  }

  function renderField(f) {
    var id = 'rbf' + (++uid);
    var unitHtml = f.unit ? '<span class="rb-ba__unit">' + esc(f.unit) + '</span>' : '';
    switch (f.type) {
      case 'html':
        return '<div class="rb-ba__html ' + (f.cls || '') + '"' + attrs(f) + '>' + f.html + '</div>';
      case 'section':
        return '<div class="rb-ba__subsection"' + attrs(f) + '><h4>' + esc(f.title) + '</h4>' + (f.text ? '<p>' + f.text + '</p>' : '') + '</div>';
      case 'name':
        return '<fieldset class="rb-ba__field rb-ba__field--name"' + attrs(f) + '><legend class="rb-ba__label">' + esc(f.label) + reqMark(f) + '</legend>' +
          '<div class="rb-ba__row3">' +
          '<div><select id="' + id + '-a" name="Anrede" autocomplete="honorific-prefix" required><option value="">Bitte wählen</option><option>Herr</option><option>Frau</option><option>Divers</option></select><label class="rb-ba__sublabel" for="' + id + '-a">Anrede</label></div>' +
          '<div><input type="text" id="' + id + '-v" name="Vorname" autocomplete="given-name"><label class="rb-ba__sublabel" for="' + id + '-v">Vorname</label></div>' +
          '<div><input type="text" id="' + id + '-n" name="Nachname" autocomplete="family-name"><label class="rb-ba__sublabel" for="' + id + '-n">Nachname</label></div>' +
          '</div><p class="rb-ba__help">Bitte füllen Sie alle Felder aus.</p><p class="rb-ba__error" role="alert"></p></fieldset>';
      case 'text': case 'email': case 'tel': case 'number':
        return '<div class="rb-ba__field"' + attrs(f) + '><label class="rb-ba__label" for="' + id + '">' + esc(f.label) + reqMark(f) + '</label>' +
          '<div class="rb-ba__input-wrap' + (f.unit ? ' has-unit' : '') + '"><input type="' + (f.type === 'number' ? 'number' : f.type) + '" id="' + id + '" name="' + esc(f.name) + '"' +
          (f.auto ? ' autocomplete="' + f.auto + '"' : '') + (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : '') +
          (f.type === 'number' ? ' inputmode="decimal"' + (f.min != null ? ' min="' + f.min + '"' : '') + (f.max != null ? ' max="' + f.max + '"' : '') + ' step="' + (f.step || '1') + '"' : '') +
          (f.type === 'tel' ? ' inputmode="tel"' : '') + '>' + unitHtml + '</div>' + help(f) + '<p class="rb-ba__error" role="alert"></p></div>';
      case 'textarea':
        return '<div class="rb-ba__field"' + attrs(f) + '><label class="rb-ba__label" for="' + id + '">' + esc(f.label) + reqMark(f) + '</label>' +
          '<textarea id="' + id + '" name="' + esc(f.name) + '" rows="5"></textarea>' + help(f) + '<p class="rb-ba__error" role="alert"></p></div>';
      case 'triple':
        var labels = f.labels || [String(YEAR - 1), String(YEAR - 2), String(YEAR - 3)];
        return '<fieldset class="rb-ba__field"' + attrs(f) + '><legend class="rb-ba__label">' + esc(f.label) + reqMark(f) + '</legend><div class="rb-ba__row3">' +
          labels.map(function (l, i) {
            return '<div><input type="text" id="' + id + '-' + i + '" name="' + esc(f.name + ' ' + l) + '"' + (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : '') + (i === 0 ? ' data-first="1"' : '') + '><label class="rb-ba__sublabel" for="' + id + '-' + i + '">' + esc(f.labels ? l : 'Jahr ' + l) + '</label></div>';
          }).join('') + '</div>' + help(f) + '<p class="rb-ba__error" role="alert"></p></fieldset>';
      case 'radio':
        return '<fieldset class="rb-ba__field"' + attrs(f) + '><legend class="rb-ba__label">' + esc(f.label) + reqMark(f) + '</legend>' +
          '<div class="rb-ba__options' + (f.stack ? ' is-stack' : '') + (f.compact ? ' is-compact' : '') + '">' + optionInputs(f, 'radio', 'rb-ba__opt rb-ba__opt--radio') + '</div>' + help(f) + '<p class="rb-ba__error" role="alert"></p></fieldset>';
      case 'checkbox':
        return '<fieldset class="rb-ba__field"' + attrs(f) + ' data-group="' + esc(f.name) + '"><legend class="rb-ba__label">' + esc(f.label) + reqMark(f) + '</legend>' +
          '<div class="rb-ba__options is-grid' + (f.stack ? ' is-stack' : '') + '">' + optionInputs(f, 'checkbox', 'rb-ba__opt rb-ba__opt--check') + '</div>' + help(f) + '<p class="rb-ba__error" role="alert"></p></fieldset>';
      case 'image':
        var gid = 'rbf' + (++uid);
        return '<fieldset class="rb-ba__field"' + attrs(f) + '><legend class="rb-ba__label">' + esc(f.label) + reqMark(f) + '</legend><div class="rb-ba__cards" data-count="' + f.options.length + '">' +
          f.options.map(function (o, i) {
            return '<label class="rb-ba__card" for="' + gid + '-' + i + '"><input type="radio" id="' + gid + '-' + i + '" name="' + esc(f.name) + '" value="' + esc(o[0]) + '">' + icon(o[1]) + '<span class="rb-ba__card-text">' + esc(o[0]) + '</span><span class="rb-ba__mark" aria-hidden="true"></span></label>';
          }).join('') + '</div>' + help(f) + '<p class="rb-ba__error" role="alert"></p></fieldset>';
      case 'matrix':
        return '<fieldset class="rb-ba__field rb-ba__field--matrix"' + attrs(f) + '><legend class="rb-ba__label">' + esc(f.label) + reqMark(f) + '</legend>' +
          '<div class="rb-ba__matrix" role="presentation"><div class="rb-ba__mrow rb-ba__mhead" aria-hidden="true"><span></span>' + f.cols.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + '</div>' +
          f.rows.map(function (r) {
            var g = 'rbf' + (++uid);
            return '<div class="rb-ba__mrow" role="radiogroup" aria-label="' + esc(r) + '"><span class="rb-ba__mlabel">' + esc(r) + reqMark(f) + '</span>' +
              f.cols.map(function (c, i) {
                return '<label class="rb-ba__mcell" for="' + g + '-' + i + '"><input type="radio" id="' + g + '-' + i + '" name="' + esc(f.name + ': ' + r) + '" value="' + esc(c) + '"><span class="rb-ba__mark" aria-hidden="true"></span><span class="rb-ba__mcol">' + esc(c) + '</span></label>';
              }).join('') + '</div>';
          }).join('') + '</div><p class="rb-ba__error" role="alert"></p></fieldset>';
      case 'file':
        return '<div class="rb-ba__field rb-ba__field--file"' + attrs(f) + '><span class="rb-ba__label" id="' + id + '-l">' + esc(f.label) + reqMark(f) + '</span>' +
          '<label class="rb-ba__drop" for="' + id + '"><input type="file" id="' + id + '" name="' + esc(f.name) + '" accept="' + f.accept + '" multiple aria-labelledby="' + id + '-l">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m0 0-4.5 4.5M12 4l4.5 4.5M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '<span class="rb-ba__drop-text"><strong>Dateien auswählen</strong> oder Foto aufnehmen</span><span class="rb-ba__drop-hint">bis zu ' + MAX_FILES_PER_FIELD + ' Dateien</span></label>' +
          '<ul class="rb-ba__files"></ul>' + help(f) + '<p class="rb-ba__error" role="alert"></p></div>';
      case 'photolist':
        return '<div class="rb-ba__field rb-ba__field--photos"' + attrs(f) + '><span class="rb-ba__label">' + esc(f.label) + '</span><ul class="rb-ba__photolist">' +
          f.items.map(function (it) {
            var hint = it.help || (it.accept && /pdf/.test(it.accept) ? 'als Foto, Scan oder PDF' : '');
            return '<li class="rb-ba__photo"' + attrs({ type: 'photo-item', when: it.when }) + '>' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5h3.2L9 6h6l1.8 2.5H20V19H4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="13.5" r="3.3" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>' +
              '<span><span class="rb-ba__photo-name">' + esc(it.label) + '</span>' + (hint ? '<span class="rb-ba__photo-hint">' + esc(hint) + '</span>' : '') + '</span></li>';
          }).join('') + '</ul></div>';
      case 'consent':
        return '<fieldset class="rb-ba__field rb-ba__field--consent"' + attrs(f) + '><legend class="rb-ba__label">Datenschutz' + reqMark(f) + '</legend>' +
          '<div class="rb-ba__privacy"><p>Offenheit im Umgang mit Ihren Daten ist uns wichtig. Mit dem Absenden Ihrer Angaben werden personenbezogene Daten erhoben. Die Daten werden ausschließlich zum Zweck der Bearbeitung Ihrer Anfrage erhoben, verarbeitet und genutzt. Sobald der Zweck entfällt, werden die von Ihnen angegebenen personenbezogenen Daten unverzüglich gelöscht. Ihre Einwilligung können Sie jederzeit widerrufen. Ihre Daten werden vertraulich behandelt und nicht zu Werbezwecken an Dritte weitergegeben.</p>' +
          '<p>Weitere Informationen finden Sie in unserer <a href="' + base + 'datenschutz/index.html" target="_blank" rel="noopener">Datenschutzerklärung</a>.</p></div>' +
          '<label class="rb-ba__opt rb-ba__opt--check" for="' + id + '"><input type="checkbox" id="' + id + '" name="' + esc(f.name) + '" value="Zugestimmt"><span class="rb-ba__mark" aria-hidden="true"></span><span class="rb-ba__opt-text">Ich habe die Datenschutzhinweise gelesen und bin mit der Verarbeitung meiner Angaben einverstanden.</span></label>' +
          '<p class="rb-ba__error" role="alert"></p></fieldset>';
    }
    return '';
  }

  var stepCount = T.pages.length;
  var html =
    '<div class="rb-ba__wrap"><form class="rb-ba__card-wrap" novalidate>' +
    '<header class="rb-ba__head"><img class="rb-ba__logo" src="' + base + 'wp-content/uploads/2024/09/reich_logo_2.png" alt="Reich Haustechnik" width="175" height="50">' +
    '<h2 class="rb-ba__title">' + esc(T.title) + '</h2></header>' +
    '<ol class="rb-ba__steps" aria-label="Fortschritt">' + T.pages.map(function (p, i) {
      return '<li class="rb-ba__step" data-step="' + i + '"><button type="button" class="rb-ba__dot" data-goto="' + i + '" aria-label="Schritt ' + (i + 1) + ': ' + esc(p.title) + '" disabled>' + (i + 1) + '</button></li>';
    }).join('') + '</ol>' +
    '<div class="rb-ba__notice" hidden></div>' +
    T.pages.map(function (p, i) {
      return '<section class="rb-ba__page" data-page="' + i + '"' + (i ? ' hidden' : '') + ' aria-labelledby="rb-ba-pt-' + i + '"><h3 class="rb-ba__page-title" id="rb-ba-pt-' + i + '">' + esc(p.title) + '</h3><div class="rb-ba__fields">' +
        p.fields.map(renderField).join('') + '</div></section>';
    }).join('') +
    '<div class="rb-ba__hp" aria-hidden="true"><label>Bitte leer lassen <input type="text" name="' + (SEND.provider === 'formsubmit' ? '_honey' : 'botcheck') + '" tabindex="-1" autocomplete="off"></label></div>' +
    '<footer class="rb-ba__nav">' +
    '<button type="button" class="rb-ba__btn rb-ba__btn--ghost" data-act="back">Zurück</button>' +
    '<button type="button" class="rb-ba__link" data-act="save">Speichern und später fortsetzen</button>' +
    '<span class="rb-ba__count" aria-live="polite">1/' + stepCount + '</span>' +
    '<button type="button" class="rb-ba__btn" data-act="next">Weiter</button>' +
    '<button type="submit" class="rb-ba__btn" data-act="submit" hidden>Absenden</button>' +
    '</footer></form></div>';
  root.innerHTML = html;

  var form = root.querySelector('form');
  var pages = [].slice.call(root.querySelectorAll('.rb-ba__page'));
  var dots = [].slice.call(root.querySelectorAll('.rb-ba__dot'));
  var steps = [].slice.call(root.querySelectorAll('.rb-ba__step'));
  var btnBack = root.querySelector('[data-act="back"]');
  var btnNext = root.querySelector('[data-act="next"]');
  var btnSubmit = root.querySelector('[data-act="submit"]');
  var btnSave = root.querySelector('[data-act="save"]');
  var counter = root.querySelector('.rb-ba__count');
  var notice = root.querySelector('.rb-ba__notice');
  var current = 0;
  var maxReached = 0;

  /* ----------------------- Bedingte Felder -------------------------- */
  var fieldEls = [].slice.call(root.querySelectorAll('[data-type]'));
  function byId(id) { return root.querySelector('[data-id="' + id + '"]'); }
  function values(el) {
    return [].slice.call(el.querySelectorAll('input:checked')).map(function (i) { return i.value; });
  }
  function isShown(el) {
    var w = el.getAttribute('data-when');
    if (!w) return true;
    w = JSON.parse(w);
    var dep = byId(w.id);
    if (!dep || !isShown(dep)) return false;
    var v = values(dep);
    if (w.in) return v.some(function (x) { return w.in.indexOf(x) >= 0; });
    if (w.has) return v.indexOf(w.has) >= 0;
    return true;
  }
  function updateConditions() {
    fieldEls.forEach(function (el) {
      if (!el.hasAttribute('data-when')) return;
      var show = isShown(el);
      el.hidden = !show;
      el.classList.toggle('is-conditional', true);
    });
  }

  /* -------------------------- Validierung --------------------------- */
  function setError(el, msg) {
    var e = el.querySelector('.rb-ba__error');
    el.classList.toggle('has-error', !!msg);
    if (e) e.textContent = msg || '';
  }
  function validateField(el) {
    if (el.hidden) { setError(el, ''); return true; }
    var t = el.getAttribute('data-type');
    var req = el.hasAttribute('data-required');
    var msg = '';
    if (t === 'name') {
      var miss = [].slice.call(el.querySelectorAll('select, input')).some(function (i) { return !i.value.trim(); });
      if (miss) msg = 'Bitte geben Sie Anrede, Vor- und Nachnamen an.';
    } else if (t === 'text' || t === 'email' || t === 'tel' || t === 'number' || t === 'textarea') {
      var inp = el.querySelector('input, textarea');
      var v = inp.value.trim();
      if (req && !v) msg = t === 'number' && inp.validity.badInput ? 'Bitte geben Sie eine Zahl ein.' : 'Bitte füllen Sie dieses Feld aus.';
      else if (v && t === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      else if (v && t === 'tel' && (v.replace(/\D/g, '').length < 6)) msg = 'Bitte geben Sie eine gültige Telefonnummer ein.';
      else if (t === 'number' && inp.validity.badInput) msg = 'Bitte geben Sie eine Zahl ein.';
      else if (v && t === 'number' && (inp.validity.rangeUnderflow || inp.validity.rangeOverflow)) msg = 'Bitte geben Sie einen Wert zwischen ' + inp.min + ' und ' + inp.max + ' an.';
    } else if (t === 'triple') {
      if (req && !el.querySelector('[data-first]').value.trim()) msg = 'Bitte füllen Sie mindestens das erste Feld aus.';
    } else if (t === 'radio' || t === 'image' || t === 'checkbox') {
      if (req && !el.querySelector('input:checked')) msg = t === 'checkbox' ? 'Bitte wählen Sie mindestens eine Option.' : 'Bitte wählen Sie eine Option.';
    } else if (t === 'matrix') {
      var open = [].slice.call(el.querySelectorAll('.rb-ba__mrow:not(.rb-ba__mhead)')).filter(function (r) { return !r.querySelector('input:checked'); });
      [].slice.call(el.querySelectorAll('.rb-ba__mrow')).forEach(function (r) { r.classList.remove('is-open'); });
      open.forEach(function (r) { r.classList.add('is-open'); });
      if (req && open.length) msg = 'Bitte bewerten Sie alle Punkte.';
    } else if (t === 'consent') {
      if (!el.querySelector('input').checked) msg = 'Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.';
    } else if (t === 'file') {
      var inpf = el.querySelector('input');
      if (inpf.files && inpf.files.length > MAX_FILES_PER_FIELD) msg = 'Bitte wählen Sie höchstens ' + MAX_FILES_PER_FIELD + ' Dateien.';
      else if (req && (!inpf.files || !inpf.files.length)) msg = 'Bitte laden Sie mindestens eine Datei hoch.';
    }
    setError(el, msg);
    return !msg;
  }
  function validatePage(i) {
    var bad = [];
    [].slice.call(pages[i].querySelectorAll('[data-type]')).forEach(function (el) { if (!validateField(el)) bad.push(el); });
    if (i === pages.length - 1 || pages[i].querySelector('[data-type="file"]')) {
      var mb = totalUploadBytes() / 1048576;
      if (mb > MAX_TOTAL_MB) {
        showNotice('Ihre Uploads sind zusammen ' + mb.toFixed(1) + ' MB groß. Bitte entfernen Sie einige Dateien (max. ' + MAX_TOTAL_MB + ' MB).', 'error');
        bad.push(notice);
      }
    }
    if (bad.length) {
      var first = bad[0];
      scrollToEl(first);
      var focusable = first.querySelector && first.querySelector('input, select, textarea');
      if (focusable) setTimeout(function () { try { focusable.focus({ preventScroll: true }); } catch (e) { focusable.focus(); } }, 350);
    }
    return !bad.length;
  }

  /* ------------------------- Navigation ----------------------------- */
  // Nur wenn der Header fixiert ist, muss seine Höhe beim Scrollen freigehalten werden.
  function headerOffset() {
    var bar = document.querySelector('.elementor-location-header .elementor-sticky--active') ||
      (document.querySelector('.elementor-location-header') || {}).firstElementChild;
    var fixed = bar && getComputedStyle(bar).position === 'fixed';
    return (fixed ? bar.offsetHeight : 0) + 16;
  }
  function scrollToEl(el) {
    var top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset() - 8;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }
  function show(i, opts) {
    current = Math.max(0, Math.min(stepCount - 1, i));
    maxReached = Math.max(maxReached, current);
    pages.forEach(function (p, k) { p.hidden = k !== current; });
    steps.forEach(function (s, k) {
      s.classList.toggle('is-active', k === current);
      s.classList.toggle('is-done', k < current || k <= maxReached && k !== current);
    });
    dots.forEach(function (d, k) {
      d.disabled = !(k <= maxReached && k !== current);
      if (k === current) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
    });
    btnBack.hidden = current === 0;
    btnNext.hidden = current === stepCount - 1;
    btnSubmit.hidden = current !== stepCount - 1;
    counter.textContent = (current + 1) + '/' + stepCount;
    if (!opts || !opts.noScroll) scrollToEl(form);
    save(false);
  }
  btnNext.addEventListener('click', function () { hideNotice(); if (validatePage(current)) show(current + 1); });
  btnBack.addEventListener('click', function () { hideNotice(); show(current - 1); });
  dots.forEach(function (d) {
    d.addEventListener('click', function () {
      var k = +d.getAttribute('data-goto');
      if (k < current || validatePage(current)) show(k);
    });
  });

  /* -------------------------- Speichern ----------------------------- */
  function collect() {
    var data = {};
    [].slice.call(form.querySelectorAll('input, select, textarea')).forEach(function (i) {
      if (i.type === 'file' || i.closest('.rb-ba__hp')) return;
      if (i.type === 'radio') { if (i.checked) data[i.name] = i.value; return; }
      if (i.type === 'checkbox') {
        var k = i.getAttribute('data-group') ? 'cb:' + i.getAttribute('data-group') : i.name;
        if (i.getAttribute('data-group')) { if (i.checked) { data[k] = data[k] || []; data[k].push(i.value); } }
        else if (i.checked) data[k] = i.value;
        return;
      }
      if (i.name && i.value) data[i.name] = i.value;
    });
    return data;
  }
  function restore(data) {
    [].slice.call(form.querySelectorAll('input, select, textarea')).forEach(function (i) {
      if (i.type === 'file' || i.closest('.rb-ba__hp')) return;
      if (i.type === 'radio') { i.checked = data[i.name] === i.value; return; }
      if (i.type === 'checkbox') {
        var g = i.getAttribute('data-group');
        if (g) i.checked = (data['cb:' + g] || []).indexOf(i.value) >= 0;
        else i.checked = data[i.name] === i.value;
        return;
      }
      if (data[i.name] != null) i.value = data[i.name];
    });
  }
  function storage() { try { return window.localStorage; } catch (e) { return null; } }
  function save(explicit) {
    var s = storage(); if (!s) { if (explicit) showNotice('Speichern ist in diesem Browser leider nicht möglich (privater Modus?).', 'error'); return; }
    try { s.setItem(STORE_KEY, JSON.stringify({ v: 1, step: current, max: maxReached, data: collect(), at: Date.now() })); } catch (e) { /* voll */ }
    if (explicit) {
      showNotice('Ihr Fortschritt wurde auf diesem Gerät gespeichert. Wenn Sie diese Seite später wieder öffnen, können Sie direkt weitermachen. (Hochgeladene Fotos müssen Sie dann erneut auswählen.)', 'ok');
      scrollToEl(notice);
    }
  }
  function clearSaved() { var s = storage(); if (s) try { s.removeItem(STORE_KEY); } catch (e) { } }
  var saveTimer;
  form.addEventListener('input', function (e) {
    updateConditions();
    var f = e.target.closest('[data-type]');
    if (f && f.classList.contains('has-error')) validateField(f);
    clearTimeout(saveTimer); saveTimer = setTimeout(function () { save(false); }, 400);
  });
  form.addEventListener('change', function (e) {
    updateConditions();
    var f = e.target.closest('[data-type]');
    if (f && f.classList.contains('has-error')) validateField(f);
    save(false);
  });
  btnSave.addEventListener('click', function () { save(true); });

  // Foto-Buttons: E-Mail mit Betreff/Text vorbefüllen und Versandweg vormerken
  function pickDelivery(v) {
    var r = [].slice.call(form.querySelectorAll('input[name="Fotos kommen per"]')).filter(function (i) { return i.value === v; })[0];
    if (r && !r.checked) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
  }
  root.addEventListener('click', function (e) {
    var mail = e.target.closest('[data-photo-mail]');
    var wa = e.target.closest('.rb-ba__btn--wa');
    if (mail) {
      var val = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
      var name = (val('Vorname') + ' ' + val('Nachname')).trim();
      var subj = 'Fotos zur ' + T.subject + (name ? ' – ' + name : '');
      var body = 'Hallo Reich-Team,\n\nanbei meine Fotos zur ' + T.subject + '.\n\n' +
        (name ? 'Name: ' + name + '\n' : '') +
        (val('Straße und Hausnummer') ? 'Adresse: ' + val('Straße und Hausnummer') + ', ' + val('Gebäudestandort (PLZ und Ort)') + '\n' : '') +
        (val('Telefon') ? 'Telefon: ' + val('Telefon') + '\n' : '') + '\nViele Grüße';
      mail.href = 'mailto:' + PHOTO_MAIL + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
      pickDelivery('Per E-Mail');
    } else if (wa) {
      pickDelivery('Per WhatsApp');
    }
  });

  function showNotice(msg, kind) {
    notice.className = 'rb-ba__notice is-' + (kind || 'ok');
    notice.innerHTML = '';
    var p = document.createElement('p'); p.textContent = msg; notice.appendChild(p);
    notice.hidden = false;
  }
  function hideNotice() { notice.hidden = true; }

  /* --------------------------- Uploads ------------------------------ */
  function fmtSize(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  function totalUploadBytes() {
    var sum = 0;
    [].slice.call(form.querySelectorAll('input[type="file"]')).forEach(function (i) {
      var w = i.closest('[data-type]');
      if (w && w.hidden) return;
      [].slice.call(i.files || []).forEach(function (f) { sum += f.size; });
    });
    return sum;
  }
  function shrink(file) {
    return new Promise(function (resolve) {
      if (!/^image\/(jpeg|png|webp|heic|heif)$/i.test(file.type) || !window.HTMLCanvasElement) return resolve(file);
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var w = img.naturalWidth, h = img.naturalHeight;
        var scale = Math.min(1, IMG_MAX_EDGE / Math.max(w, h));
        if (scale === 1 && file.size < 900 * 1024) { URL.revokeObjectURL(url); return resolve(file); }
        var c = document.createElement('canvas');
        c.width = Math.round(w * scale); c.height = Math.round(h * scale);
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (blob) {
          if (!blob || blob.size >= file.size) return resolve(file);
          var name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
          try { resolve(new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() })); } catch (e) { resolve(file); }
        }, 'image/jpeg', IMG_QUALITY);
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }
  function renderFileList(input) {
    var list = input.closest('[data-type]').querySelector('.rb-ba__files');
    list.innerHTML = '';
    [].slice.call(input.files || []).forEach(function (f, idx) {
      var li = document.createElement('li');
      var span = document.createElement('span'); span.textContent = f.name + ' (' + fmtSize(f.size) + ')';
      var rm = document.createElement('button'); rm.type = 'button'; rm.className = 'rb-ba__file-rm'; rm.setAttribute('aria-label', f.name + ' entfernen'); rm.textContent = '×';
      rm.addEventListener('click', function () { removeFile(input, idx); });
      li.appendChild(span); li.appendChild(rm); list.appendChild(li);
    });
  }
  function setFiles(input, arr) {
    try {
      var dt = new DataTransfer();
      arr.forEach(function (f) { dt.items.add(f); });
      input.files = dt.files;
      return true;
    } catch (e) { return false; }
  }
  function removeFile(input, idx) {
    var arr = [].slice.call(input.files || []);
    arr.splice(idx, 1);
    if (!setFiles(input, arr)) input.value = '';
    renderFileList(input);
    validateField(input.closest('[data-type]'));
  }
  form.addEventListener('change', function (e) {
    var input = e.target;
    if (input.type !== 'file') return;
    var wrap = input.closest('[data-type]');
    var arr = [].slice.call(input.files || []);
    if (arr.length > MAX_FILES_PER_FIELD) {
      arr = arr.slice(0, MAX_FILES_PER_FIELD);
      setError(wrap, 'Es wurden nur die ersten ' + MAX_FILES_PER_FIELD + ' Dateien übernommen.');
    } else setError(wrap, '');
    wrap.classList.add('is-busy');
    Promise.all(arr.map(shrink)).then(function (out) {
      setFiles(input, out);
      wrap.classList.remove('is-busy');
      renderFileList(input);
    });
  });

  /* --------------------------- Absenden ----------------------------- */
  function prepareHidden(name, value) {
    var i = document.createElement('input');
    i.type = 'hidden'; i.name = name; i.value = value; i.className = 'rb-ba__gen';
    form.appendChild(i);
  }
  function fullUrl(extra) {
    return location.href.split('#')[0].split('?')[0] + extra;
  }
  function successView(msg) {
    clearSaved();
    root.innerHTML = '<div class="rb-ba__wrap"><div class="rb-ba__card-wrap rb-ba__done">' +
      '<img class="rb-ba__logo" src="' + base + 'wp-content/uploads/2024/09/reich_logo_2.png" alt="Reich Haustechnik" width="175" height="50">' +
      '<div class="rb-ba__done-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
      '<h2 class="rb-ba__title">Vielen Dank für Ihre Angaben!</h2>' +
      '<p>' + msg + '</p><p>Nun arbeiten wir für Sie und erstellen Ihr individuelles Angebot. Wir melden uns schnellstmöglich bei Ihnen. Bei Fragen erreichen Sie uns unter <a href="tel:' + PHONE_TEL + '">' + PHONE + '</a>.</p>' +
      '<button type="button" class="rb-ba__btn" data-act="continue">Weiter zu unseren Leistungen</button></div></div>';
    root.querySelector('[data-act="continue"]').addEventListener('click', function () {
      if (root.nextElementSibling) scrollToEl(root.nextElementSibling);
    });
    scrollToEl(root);
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideNotice();
    for (var i = 0; i < stepCount; i++) {
      if (!validatePage(i)) { show(i, { noScroll: true }); validatePage(i); return; }
    }
    [].slice.call(form.querySelectorAll('.rb-ba__gen')).forEach(function (n) { n.remove(); });
    var vorname = (form.querySelector('[name="Vorname"]') || {}).value || '';
    var nachname = (form.querySelector('[name="Nachname"]') || {}).value || '';
    var email = (form.querySelector('[name="E-Mail"]') || {}).value || '';
    var subject = T.subject + ' – ' + vorname + ' ' + nachname;

    // Checkbox-Gruppen als ein lesbares Feld übertragen
    [].slice.call(form.querySelectorAll('fieldset[data-group]')).forEach(function (fs) {
      if (fs.hidden) return;
      var v = values(fs);
      if (v.length) prepareHidden(fs.getAttribute('data-group'), v.join(', '));
    });
    // ausgeblendete Felder nicht mitsenden
    fieldEls.forEach(function (el) {
      [].slice.call(el.querySelectorAll('input, select, textarea')).forEach(function (inp) { inp.disabled = !!el.hidden; });
    });
    prepareHidden('Thema', T.subject);
    prepareHidden('Seite', fullUrl(''));

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Wird gesendet …';
    form.classList.add('is-sending');

    function sendFailed(msg) {
      form.classList.remove('is-sending');
      btnSubmit.disabled = false; btnSubmit.textContent = 'Absenden';
      fieldEls.forEach(function (el) { [].slice.call(el.querySelectorAll('input, select, textarea')).forEach(function (inp) { inp.disabled = false; }); });
      updateConditions();
      showNotice(msg || ('Das Senden hat leider nicht geklappt. Ihre Angaben sind gespeichert – bitte versuchen Sie es später erneut oder rufen Sie uns an: ' + PHONE + '.'), 'error');
      scrollToEl(notice);
    }
    function textPayload() {
      var o = {};
      new FormData(form).forEach(function (v, k) { if (typeof v === 'string') o[k] = v; });
      if (!o.botcheck) delete o.botcheck;
      return o;
    }
    function postJSON(url, body, isForm) {
      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 30000) : null;
      var opts = { method: 'POST', headers: { Accept: 'application/json' }, body: body };
      if (!isForm) opts.headers['Content-Type'] = 'application/json';
      if (ctrl) opts.signal = ctrl.signal;
      return fetch(url, opts)
        .then(function (r) { return r.json().catch(function () { return { success: false, message: 'HTTP ' + r.status }; }); })
        .finally(function () { if (timer) clearTimeout(timer); });
    }
    var hasFiles = [].slice.call(form.querySelectorAll('input[type="file"]')).some(function (i) { return !i.disabled && i.files && i.files.length; });
    save(false);

    if (SEND.provider === 'web3forms') {
      if (!SEND.web3formsKey || /HIER-ACCESS-KEY/.test(SEND.web3formsKey)) {
        return successView('Demo-Modus: Es ist noch kein Web3Forms Access Key eingetragen – Ihre Angaben wurden nicht versendet.');
      }
      var meta = { access_key: SEND.web3formsKey, subject: subject, from_name: 'Reich Haustechnik – Bestandsaufnahme', replyto: email };
      var req;
      if (ATTACHMENTS && hasFiles) {
        var fd = new FormData(form);
        if (!fd.get('botcheck')) fd.delete('botcheck');
        Object.keys(meta).forEach(function (k) { fd.append(k, meta[k]); });
        req = postJSON('https://api.web3forms.com/submit', fd, true);
      } else {
        var payload = textPayload();
        Object.keys(meta).forEach(function (k) { payload[k] = meta[k]; });
        req = postJSON('https://api.web3forms.com/submit', JSON.stringify(payload), false);
      }
      req.then(function (j) {
        if (j && (j.success === true || String(j.success) === 'true')) successView('Ihre Bestandsaufnahme wurde erfolgreich übermittelt.');
        else sendFailed();
      }).catch(function () { sendFailed(); });
      return;
    }

    if (SEND.provider === 'formsubmit' && SEND.formsubmitTo) {
      var to = encodeURIComponent(SEND.formsubmitTo);
      prepareHidden('_subject', subject);
      prepareHidden('_template', 'table');
      prepareHidden('_captcha', 'false');
      prepareHidden('_replyto', email);
      if (!hasFiles) {
        // ohne Anhänge: im Hintergrund senden, Fehler direkt im Formular anzeigen
        fetch('https://formsubmit.co/ajax/' + to, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(textPayload())
        })
          .then(function (r) { return r.json(); })
          .then(function (j) {
            if (j && String(j.success) === 'true') return successView('Ihre Bestandsaufnahme wurde erfolgreich übermittelt.');
            var m = (j && j.message) || '';
            if (/activat/i.test(m)) return sendFailed('Fast geschafft: Das Formular muss einmalig aktiviert werden. FormSubmit hat dafür eine E-Mail an die hinterlegte Adresse geschickt – bitte dort auf „Activate Form“ klicken und danach erneut absenden.');
            sendFailed();
          })
          .catch(function () { sendFailed(); });
        return;
      }
      // mit Anhängen: klassischer Versand, danach Rückkehr auf diese Seite
      prepareHidden('_next', fullUrl('?bestandsaufnahme=gesendet#bestandsaufnahme'));
      form.action = 'https://formsubmit.co/' + to;
      form.method = 'POST';
      form.enctype = 'multipart/form-data';
      form.setAttribute('accept-charset', 'UTF-8');
      HTMLFormElement.prototype.submit.call(form);
      return;
    }
    successView('Demo-Modus: Ihre Angaben wurden nicht versendet.');
  });

  /* ----------------------------- Start ------------------------------ */
  updateConditions();
  if (/[?&]bestandsaufnahme=gesendet/.test(location.search)) {
    successView('Ihre Bestandsaufnahme wurde erfolgreich übermittelt.');
    if (history.replaceState) history.replaceState(null, '', location.pathname + '#bestandsaufnahme');
    return;
  }
  var saved = null;
  try { var s = storage(); saved = s && JSON.parse(s.getItem(STORE_KEY) || 'null'); } catch (e) { saved = null; }
  if (saved && saved.data && Object.keys(saved.data).length > 0) {
    restore(saved.data);
    updateConditions();
    maxReached = Math.min(stepCount - 1, saved.max || 0);
    show(saved.step || 0, { noScroll: true });
    notice.className = 'rb-ba__notice is-ok';
    notice.innerHTML = '<p>Willkommen zurück! Ihre gespeicherten Angaben wurden geladen. <button type="button" class="rb-ba__link" data-act="reset">Neu beginnen</button></p>';
    notice.hidden = false;
    notice.querySelector('[data-act="reset"]').addEventListener('click', function () {
      clearSaved(); form.reset(); [].slice.call(form.querySelectorAll('.rb-ba__files')).forEach(function (l) { l.innerHTML = ''; });
      maxReached = 0; updateConditions(); hideNotice(); show(0);
    });
  } else {
    show(0, { noScroll: true });
  }
})();
