class Keybord {
  constructor(lang) {
    this.lang = lang;
    this.isCaps = false;
    this.case = false;
    this.keyDown = this.keyDown.bind(this);
    this.keyUp = this.keyUp.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.keyCodes = [
      192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 173, 61, 8, 9,
      81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220, 46,
      20, 65, 83, 68, 70, 71, 72, 74, 75, 76, 59, 222, 13, 16,
      90, 88, 67, 86, 66, 78, 77, 188, 190, 191, 38, 16, 17, 91,
      18, 32, 18, 17, 37, 40, 39,
    ];
    this.keys = {
      en: [
        '`~', '1!', '2@', '3#', '4$', '5%', '6^', '7&', '8*', '9(', '0)', '-_', '=+', 'Backspase',
        'Tab', 'qQ', 'wW', 'eE', 'rR', 'tT', 'yY', 'uU', 'iI', 'oO', 'pP', '[{', ']}', '\\|',
        'Del', 'CapsLock', 'aA', 'sS', 'dD', 'fF', 'gG', 'hH', 'jJ', 'kK', 'lL', ';:', "'\"",
        'Enter', 'Shift', 'zZ', 'xX', 'cC', 'vV', 'bB', 'nN', 'mM', ',<', '.>', '/?', 'Uper',
        'Shift', 'Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Ctrl', 'Left', 'Down',
        'Right',
      ],
      ru: [
        'ёЁ', '1!', '2"', '3№', '4;', '5%', '6:', '7?', '8*', '9(', '0)', '-_', '=+', 'Backspase',
        'Tab', 'йЙ', 'цЦ', 'уУ', 'кК', 'еЕ', 'нН', 'гГ', 'шШ', 'щЩ', 'зЗ', 'хХ', 'ъЪ', '\\/',
        'Del', 'CapsLock', 'фФ', 'ыЫ', 'вВ', 'аА', 'пП', 'рР', 'оО', 'лЛ', 'дД', 'жЖ', 'эЭ',
        'Enter', 'Shift', 'яЯ', 'чЧ', 'сС', 'мМ', 'иИ', 'тТ', 'ьЬ', 'бБ', 'юЮ', '.,', 'Uper',
        'Shift', 'Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Ctrl', 'Left', 'Down',
        'Right',
      ],
    };
    this.textArea = document.createElement('textarea');
    this.keybord = document.createElement('div');
    this.keybord.classList.add('keybord');
    for (let i = 0; i < this.keyCodes.length; i += 1) {
      this[this.keyCodes[i]] = false;
      const button = document.createElement('div');
      let textInButton;
      if (this.keys[this.lang][i].length === 2) {
        textInButton = document.createTextNode(`${this.keys[this.lang][i][0]}`);
      } else {
        textInButton = document.createTextNode(`${this.keys[this.lang][i]}`);
      }
      button.classList.add('button', `code${this.keyCodes[i]}`);
      button.appendChild(textInButton);
      this.keybord.appendChild(button);
    }
  }

  initKeybord() {
    document.body.appendChild(this.textArea);
    document.body.appendChild(this.keybord);
    document.addEventListener('keydown', this.keyDown);
    document.addEventListener('keyup', this.keyUp);
    this.keybord.addEventListener('mousedown', this.mouseDown);
    this.keybord.addEventListener('mouseup', this.mouseUp);
    this.textArea.addEventListener('keypress', (event) => event.preventDefault());
    document.addEventListener('keypress', (event) => event.preventDefault());
  }

  insertChar(char, pos) {
    const str = this.textArea.value;
    return str.substr(0, pos) + char + str.substr(pos);
  }

  switсhLang(toLang) {
    localStorage.setItem('lang', toLang);
    this.lang = toLang;
    for (let i = 0; i < this.keyCodes.length; i += 1) {
      if (this.keys[this.lang][i].length === 2) {
        this.keybord.childNodes[i].innerHTML = this.keys[this.lang][i][(this.case) ? 1 : 0];
      }
    }
  }

  swithCase(isUp, from) {
    for (let i = from; i < this.keyCodes.length; i += 1) {
      if (this.keys[this.lang][i].length === 2) {
        this.keybord.childNodes[i].innerHTML = this.keys[this.lang][i][(isUp) ? 1 : 0];
      }
    }
  }

  keyUp(event) {
    if (!this.keyCodes.includes(event.keyCode)) {
      return;
    }
    this[event.keyCode] = false;
    this.keybord.querySelector(`.code${event.keyCode}`).classList.remove('active');
    if (event.keyCode === 16) {
      this.swithCase(false, 0);
    }
  }

  listenKombo() {
    if (this[17] && this[18]) {
      this.switсhLang((this.lang === 'en') ? 'ru' : 'en');
    }
    if (this[16]) {
      this.swithCase(true, 0);
    }
  }

  mouseDown(event) {
    const button = event.target;
    if (button === event.currentTarget) {
      return;
    }
    const keyCode = Number(button.classList[1].substr(4));
    this.writeSym(event, keyCode);
  }

  mouseUp(event) {
    const button = event.target;
    if (button === event.currentTarget) {
      return;
    }
    const keyCode = Number(button.classList[1].substr(4));
    this.keyUp({ keyCode });
  }

  keyDown(event) {
    this.writeSym(event, event.keyCode);
  }

  writeSym(event, keyCode) {
    if (!this.keyCodes.includes(keyCode)) {
      return;
    }
    event.preventDefault();
    this.textArea.focus();
    this[keyCode] = true;
    this.listenKombo();
    this.keybord.querySelector(`.code${keyCode}`).classList.add('active');
    const pos = this.textArea.selectionEnd;
    switch (keyCode) {
      case 8: // Backspace
        if (pos === 0) {
          return;
        }
        this.textArea.value = this.textArea.value.substr(0, pos - 1)
          + this.textArea.value.substr(pos);
        this.textArea.selectionEnd = pos - 1;
        this.textArea.selectionStart = pos - 1;
        break;
      case 46: // Del
        this.textArea.value = this.textArea.value.substr(0, pos)
          + this.textArea.value.substr(pos + 1);
        this.textArea.selectionEnd = pos;
        break;
      case 37: // arrowLeft
        if (this.textArea.selectionEnd > 0) {
          this.textArea.selectionEnd -= 1;
        }
        break;
      case 39: // arrowRight
        if (this.textArea.selectionEnd < this.textArea.value.length) {
          this.textArea.selectionEnd += 1;
          this.textArea.selectionStart += 1;
        }
        break;
      case 38: // arrowUp
        break;
      case 40: // arrowDown
        break;
      case 13: // Enter
        this.textArea.value = this.insertChar('\n', pos);
        this.textArea.selectionStart = pos + 1;
        this.textArea.selectionEnd = pos + 1;
        break;
      case 20: // Tab
        this.swithCase(this.case = !this.case, 14); // little magic number,
        break; // but it for no change key from 1 to tab
      case 16:
        break;
      case 17:
        break;
      case 18:
        break;
      case 9:
        break;
      case 32:
        this.textArea.value = this.insertChar(' ', pos);
        this.textArea.selectionStart = pos + 1;
        this.textArea.selectionEnd = pos + 1;
        break;
      default:
        this.textArea.value = this.insertChar(document.querySelector(`.code${keyCode}`)
          .innerHTML, pos);
        this.textArea.selectionEnd = pos
            + document.querySelector(`.code${keyCode}`).innerHTML.length;
        this.textArea.selectionStart = this.textArea.selectionEnd;
    }
  }
}

const lang = localStorage.getItem('lang');
let keybord;
if (lang) {
  keybord = new Keybord(lang);
} else {
  localStorage.setItem('lang', 'ru');
  keybord = new Keybord('ru');
}
keybord.initKeybord();
