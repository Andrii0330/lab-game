class Dice {
  static roll(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }
}

class Character {
  #hp;

  constructor(name, hp, armorClass, attackBonus, damageDice) {
    this.name = name;
    this.maxHp = hp;
    this.#hp = hp;
    this.armorClass = armorClass;
    this.attackBonus = attackBonus;
    this.damageDice = damageDice;
    this.isDefending = false; // 🆕 Додано стан захисту
  }

  get hp() {
    return this.#hp;
  }

  isAlive() {
    return this.#hp > 0;
  }

  // 🆕 Новий метод для захисту
  defend() {
    this.isDefending = true;
    console.log(`\n🛡️ ${this.name} стає в захисну стійку! Наступний отриманий урон буде зменшено вдвічі.`);
  }

  takeDamage(amount) {
    // 🆕 Якщо персонаж у стані захисту, зменшуємо урон
    if (this.isDefending) {
      amount = Math.floor(amount / 2);
      console.log(`🛡️ ${this.name} успішно блокує частину удару!`);
      this.isDefending = false; // Захист спрацьовує лише на один удар
    }

    this.#hp = Math.max(0, this.#hp - amount);

    console.log(
      `💥 ${this.name} отримує ${amount} урону! ` +
      `(Залишилось HP: ${this.#hp}/${this.maxHp})`
    );
  }

  restoreHealth(amount) {
    this.#hp = Math.min(this.maxHp, this.#hp + amount);
  }

  attack(target) {
    console.log(`\n⚔️ ${this.name} атакує ${target.name}...`);

    const d20 = Dice.roll(20);
    const attackRoll = d20 + this.attackBonus;

    console.log(`🎲 Кидок: ${d20} + ${this.attackBonus} = ${attackRoll} (Броня: ${target.armorClass})`);

    if (d20 === 1) {
      console.log(`❌ Критичний промах! ${this.name} епічно схибив.`);
    } else if (d20 === 20 || attackRoll >= target.armorClass) {
      let damage = Dice.roll(this.damageDice);

      if (d20 === 20) {
        console.log(`🎯 КРИТИЧНЕ ПОПАДАННЯ! Урон подвоєно.`);
        damage *= 2;
      } else {
        console.log(`✔️ Успішне попадання!`);
      }
      target.takeDamage(damage);
    } else {
      console.log(`🛡️ Не пробив броню! Атака відбита.`);
    }
  }
}

class Hero extends Character {
  constructor(name, hp, armorClass, attackBonus, damageDice, healthPotions, specialUses) {
    super(name, hp, armorClass, attackBonus, damageDice);
    this.healthPotions = healthPotions;
    this.specialUses = specialUses;
  }

  heal() {
    if (this.healthPotions > 0) {
      const healAmount = Dice.roll(8) + 5; 
      this.restoreHealth(healAmount);
      this.healthPotions--;
      console.log(`\n🧪 ${this.name} п'є зілля і відновлює ${healAmount} HP! (HP: ${this.hp}/${this.maxHp}. Залишилось: ${this.healthPotions})`);
      return true;
    } else {
      console.log(`\n⚠️ У ${this.name} закінчились зілля! Оберіть іншу дію.`);
      return false;
    }
  }

  useSpecialAbility(target) {
    return false;
  }
}

class Warrior extends Hero {
  constructor(name) {
    super(name, 40, 15, 6, 8, 2, 2);
    this.className = "Воїн";
  }
  useSpecialAbility(target) {
    if (this.specialUses <= 0) {
      console.log(`\n⚠️ Не залишилось зарядів здібності! Оберіть іншу дію.`);
      return false;
    }
    this.specialUses--;
    console.log(`\n✨ ${this.name} використовує [РУЙНІВНИЙ УДАР]!`);
    const damage = Dice.roll(12) + 4; 
    target.takeDamage(damage);
    return true;
  }
}

class Mage extends Hero {
  constructor(name) {
    super(name, 25, 11, 4, 6, 3, 3);
    this.className = "Маг";
  }
  useSpecialAbility(target) {
    if (this.specialUses <= 0) {
      console.log(`\n⚠️ Не залишилось мани! Оберіть іншу дію.`);
      return false;
    }
    this.specialUses--;
    console.log(`\n🔥 ${this.name} чаклує [ВОГНЯНУ КУЛЮ]!`);
    const damage = Dice.roll(10) + Dice.roll(10); 
    target.takeDamage(damage);
    return true;
  }
}

class Rogue extends Hero {
  constructor(name) {
    super(name, 30, 13, 7, 6, 2, 2);
    this.className = "Розбійник";
  }
  useSpecialAbility(target) {
    if (this.specialUses <= 0) {
      console.log(`\n⚠️ Не залишилось енергії! Оберіть іншу дію.`);
      return false;
    }
    this.specialUses--;
    console.log(`\n🗡️ ${this.name} виконує [ПІДСТУПНУ АТАКУ]! Урон потроєно.`);
    const damage = Dice.roll(this.damageDice) * 3;
    target.takeDamage(damage);
    return true;
  }
}

class Archer extends Hero {
  constructor(name) {
    super(name, 28, 14, 8, 8, 2, 2);
    this.className = "Лучник";
  }

  useSpecialAbility(target) {
    if (this.specialUses <= 0) {
      console.log(`\n⚠️ Не залишилось стріл для спецприйому! Оберіть іншу дію.`);
      return false;
    }
    
    this.specialUses--;
    console.log(`\n🏹 ${this.name} використовує [ШКВАЛ СТРІЛ]! Випускає 3 стріли підряд.`);
    
    let totalDamage = 0;
    for (let i = 1; i <= 3; i++) {
      const arrowDamage = Dice.roll(6); 
      totalDamage += arrowDamage;
      console.log(`   🏹 Стріла ${i} влучає і наносить ${arrowDamage} урону.`);
    }
    
    target.takeDamage(totalDamage);
    return true;
  }
}

class Arena {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.round = 1;
  }

  startBattle() {
    console.log(`\n=========================================`);
    console.log(`🔥 БІЙ ПОЧИНАЄТЬСЯ: ${this.player1.name} VS ${this.player2.name} 🔥`);
    console.log(`=========================================`);

    while (this.player1.isAlive() && this.player2.isAlive()) {
      console.log(`\n--- РАУНД ${this.round} ---`);
      
      const p1HpBefore = this.player1.hp;
      const p2HpBefore = this.player2.hp;
      
      this.executeTurn(this.player1, this.player2);
      
      if (this.player2.isAlive()) {
        this.executeTurn(this.player2, this.player1);
      }
      
      const p1Diff = this.player1.hp - p1HpBefore;
      const p2Diff = this.player2.hp - p2HpBefore;

      const formatStatus = (diff) => {
        if (diff < 0) return `втратив ${Math.abs(diff)} HP 🩸`;
        if (diff > 0) return `відновив ${diff} HP 💚`;
        return `без змін 🛡️`;
      };

      alert(
        `--- ПІДСУМОК РАУНДУ ${this.round} ---\n\n` +
        `🔹 ${this.player1.name} ${formatStatus(p1Diff)} \n(Залишилось HP: ${this.player1.hp}/${this.player1.maxHp})\n\n` +
        `🔸 ${this.player2.name} ${formatStatus(p2Diff)} \n(Залишилось HP: ${this.player2.hp}/${this.player2.maxHp})\n\n` +
        `Натисніть OK, щоб продовжити.`
      );

      if (!this.player1.isAlive() || !this.player2.isAlive()) break;
      
      this.round++;
    }

    this.announceWinner();
  }

  executeTurn(attacker, defender) {
    // 🆕 Скидаємо захист на початку свого ходу, щоб він не висів "вічно"
    attacker.isDefending = false; 
    let actionCompleted = false;
    
    while (!actionCompleted) {
      const choice = prompt(
        `--- ХІД: ${attacker.name} (${attacker.className}) ---\n` +
        `Ваше HP: ${attacker.hp}/${attacker.maxHp} | Зілля: ${attacker.healthPotions} | Спец: ${attacker.specialUses}\n` +
        `Ворог (${defender.name}) HP: ${defender.hp}/${defender.maxHp}\n\n` +
        `Оберіть дію:\n` +
        `1 - ⚔️ Звичайна атака\n` +
        `2 - 🧪 Зілля здоров'я\n` +
        `3 - ✨ Спец. здібність\n` +
        `4 - 🛡️ Захист (зменшує наступний урон вдвічі)` // 🆕 Додано 4 пункт
      );

      if (choice === "1") {
        attacker.attack(defender);
        actionCompleted = true;
      } else if (choice === "2") {
        actionCompleted = attacker.heal();
      } else if (choice === "3") {
        actionCompleted = attacker.useSpecialAbility(defender);
      } else if (choice === "4") {
        // 🆕 Виклик нової дії
        attacker.defend();
        actionCompleted = true;
      } else {
        console.log("\n❌ Невірний вибір! Введіть 1, 2, 3 або 4.");
      }
    }
  }

  announceWinner() {
    console.log(`\n=========================================`);
    if (this.player1.isAlive()) {
      console.log(`🏆 ПЕРЕМОГА! ${this.player1.name} перемагає у битві з ${this.player1.hp} HP!`);
      alert(`🏆 ПЕРЕМОГА!\n\n${this.player1.name} перемагає у битві з ${this.player1.hp} HP!`);
    } else {
      console.log(`🏆 ПЕРЕМОГА! ${this.player2.name} перемагає у битві з ${this.player2.hp} HP!`);
      alert(`🏆 ПЕРЕМОГА!\n\n${this.player2.name} перемагає у битві з ${this.player2.hp} HP!`);
    }
    console.log(`=========================================`);
  }
}

// --- ФУНКЦІЇ ДЛЯ ЗАПУСКУ ГРИ ---
function createPlayer(playerNumber) {
  let rawName = prompt(`Гравець ${playerNumber}, введіть ім'я вашого героя:`);
  let name = (rawName && rawName.trim() !== "") ? rawName.trim() : `Герой ${playerNumber}`;

  let heroClass = null;
  while (!heroClass) {
    const choice = prompt(
      `Гравець ${playerNumber} (${name}), виберіть клас:\n\n` +
      `1 - ⚔️ Воїн (Багато ХП, сильний удар, 2 спец.)\n` +
      `2 - 🔥 Маг (Мало ХП, масовий урон, 3 спец.)\n` +
      `3 - 🗡️ Розбійник (Середнє ХП, потроєний урон, 2 спец.)\n` +
      `4 - 🏹 Лучник (Влучний, шквал із 3-х стріл, 2 спец.)`
    );

    if (choice === "1") heroClass = new Warrior(name);
    else if (choice === "2") heroClass = new Mage(name);
    else if (choice === "3") heroClass = new Rogue(name);
    else if (choice === "4") heroClass = new Archer(name);
    else alert("Невірний вибір. Введіть 1, 2, 3 або 4.");
  }
  return heroClass;
}

function startGameLoop() {
  console.clear();
  let playAgain = true;

  while (playAgain) {
    const p1 = createPlayer(1);
    const p2 = createPlayer(2);

    const battle = new Arena(p1, p2);
    battle.startBattle();

    const answer = prompt("Бій завершено! Бажаєте зіграти ще раз? (Так/Ні)");
    if (!answer || !["так", "т", "yes", "y", "1", "+"].includes(answer.toLowerCase().trim())) {
      playAgain = false;
      console.log("\nДякуємо за гру! Епічні битви чекають на ваше повернення.");
    } else {
      console.clear();
    }
  }
}

// Запуск гри
startGameLoop();