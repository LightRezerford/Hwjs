// Оружие
class Weapon {
  constructor(name, attack, durability, range) {
    this.name = name;
    this.attack = attack;
    this.durability = durability;
    this.initDurability = durability;
    this.range = range;
  }

  takeDamage(damage) {
    this.durability -= damage;
    if (this.durability < 0) {
      this.durability = 0;
    }
  }

  getDamage() {
    if (this.durability === 0) {
      return 0;
    }
    if (this.durability >= this.initDurability * 0.3) {
      return this.attack;
    }
    return this.attack / 2;
  }

  isBroken() {
    return this.durability === 0;
  }
}

class Arm extends Weapon {
  constructor() {
    super('Рука', 1, Infinity, 1);
  }
}

class Bow extends Weapon {
  constructor() {
    super('Лук', 10, 200, 3);
  }
}

class Sword extends Weapon {
  constructor() {
    super('Меч', 25, 500, 1);
  }
}

class Knife extends Weapon {
  constructor() {
    super('Нож', 5, 300, 1);
  }
}

class Staff extends Weapon {
  constructor() {
    super('Посох', 8, 300, 2);
  }
}

class LongBow extends Bow {
  constructor() {
    super();
    this.name = 'Длинный лук';
    this.attack = 15;
    this.range = 4;
  }
}

class Axe extends Sword {
  constructor() {
    super();
    this.name = 'Секира';
    this.attack = 27;
    this.durability = 800;
    this.initDurability = 800;
  }
}

class StormStaff extends Staff {
  constructor() {
    super();
    this.name = 'Посох Бури';
    this.attack = 10;
    this.range = 3;
  }
}

// Игроки
class Player {
  constructor(position, name) {
    this.life = 100;
    this.magic = 20;
    this.speed = 1;
    this.attack = 10;
    this.agility = 5;
    this.luck = 10;
    this.description = 'Игрок';
    this.weapon = new Arm();
    this.position = position;
    this.name = name;
    this.initLife = this.life;
    this.initMagic = this.magic;
    this.weaponsFallback = [new Knife(), new Arm()];
  }

  getLuck() {
    const randomNumber = Math.random() * 100;
    return (randomNumber + this.luck) / 100;
  }

  getDamage(distance) {
    if (distance > this.weapon.range) {
      return 0;
    }
    return (this.attack + this.weapon.getDamage()) * this.getLuck() / distance;
  }

  takeDamage(damage) {
    this.life -= damage;
    if (this.life < 0) {
      this.life = 0;
    }
  }

  isDead() {
    return this.life === 0;
  }

  moveLeft(distance) {
    const moveDistance = Math.min(distance, this.speed);
    this.position -= moveDistance;
    console.log(`${this.name} идет влево на ${moveDistance}`);
  }

  moveRight(distance) {
    const moveDistance = Math.min(distance, this.speed);
    this.position += moveDistance;
    console.log(`${this.name} идет вправо на ${moveDistance}`);
  }

  move(distance) {
    if (distance < 0) {
      this.moveLeft(-distance);
    } else {
      this.moveRight(distance);
    }
  }

  isAttackBlocked() {
    return this.getLuck() > (100 - this.luck) / 100;
  }

  dodged() {
    return this.getLuck() > (100 - this.agility - this.speed * 3) / 100;
  }

  checkWeapon() {
    if (this.weapon.isBroken() && this.weaponsFallback.length > 0) {
      this.weapon = this.weaponsFallback.shift();
    }
  }

  takeAttack(damage) {
    if (this.isAttackBlocked()) {
      this.weapon.takeDamage(damage);
      this.checkWeapon();
      console.log(`${this.name} заблокировал атаку`);
    } else if (this.dodged()) {
      console.log(`${this.name} уклонился от атаки`);
    } else {
      this.takeDamage(damage);
      console.log(`${this.name} получил урон`);
    }
  }

  tryAttack(enemy) {
    const distance = Math.abs(this.position - enemy.position);
    if (distance > this.weapon.range) {
      console.log(`${this.name}: враг слишком далеко`);
      return;
    }

    this.weapon.takeDamage(10 * this.getLuck());
    this.checkWeapon();

    const attackDistance = distance === 0 ? 1 : distance;
    const damage = this.getDamage(attackDistance);
    if (distance === 0) {
      enemy.position += 1;
      enemy.takeAttack(damage * 2);
    } else {
      enemy.takeAttack(damage);
    }
  }

  chooseEnemy(players) {
    let enemy = null;
    for (const player of players) {
      if (player !== this && !player.isDead()) {
        if (enemy === null || player.life < enemy.life) {
          enemy = player;
        }
      }
    }
    return enemy;
  }

  moveToEnemy(enemy) {
    if (!enemy) {
      return;
    }
    this.move(enemy.position - this.position);
  }

  turn(players) {
    if (this.isDead()) {
      return;
    }
    const enemy = this.chooseEnemy(players);
    if (enemy) {
      this.moveToEnemy(enemy);
      this.tryAttack(enemy);
    }
  }
}

class Warrior extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 120;
    this.initLife = 120;
    this.speed = 2;
    this.description = 'Воин';
    this.weapon = new Sword();
  }

  takeDamage(damage) {
    if (
      this.life < this.initLife * 0.5 &&
      this.getLuck() > 0.8 &&
      this.magic > 0
    ) {
      if (this.magic >= damage) {
        this.magic -= damage;
      } else {
        const remainingDamage = damage - this.magic;
        this.magic = 0;
        this.life -= remainingDamage;
      }
    } else {
      super.takeDamage(damage);
    }
    if (this.life < 0) {
      this.life = 0;
    }
  }
}

class Archer extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 80;
    this.initLife = 80;
    this.magic = 35;
    this.speed = 2;
    this.attack = 5;
    this.agility = 10;
    this.description = 'Лучник';
    this.weapon = new Bow();
  }

  getDamage(distance) {
    if (distance > this.weapon.range) {
      return 0;
    }
    return (this.attack + this.weapon.getDamage()) *
      this.getLuck() * distance / this.weapon.range;
  }
}

class Mage extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 70;
    this.initLife = 70;
    this.magic = 100;
    this.initMagic = 100;
    this.attack = 5;
    this.agility = 8;
    this.description = 'Маг';
    this.weapon = new Staff();
  }

  takeDamage(damage) {
    if (this.magic > this.initMagic * 0.5) {
      damage /= 2;
      this.magic = Math.max(0, this.magic - 12);
    }
    super.takeDamage(damage);
  }
}

class Dwarf extends Warrior {
  constructor(position, name) {
    super(position, name);
    this.life = 130;
    this.initLife = 130;
    this.attack = 15;
    this.luck = 20;
    this.description = 'Гном';
    this.weapon = new Axe();
    this.hitCount = 0;
  }

  takeDamage(damage) {
    this.hitCount++;
    if (this.hitCount % 6 === 0 && this.getLuck() > 0.5) {
      damage /= 2;
    }
    super.takeDamage(damage);
  }
}

class Crossbowman extends Archer {
  constructor(position, name) {
    super(position, name);
    this.life = 85;
    this.initLife = 85;
    this.attack = 8;
    this.agility = 20;
    this.luck = 15;
    this.description = 'Арбалетчик';
    this.weapon = new LongBow();
  }
}

class Demiurge extends Mage {
  constructor(position, name) {
    super(position, name);
    this.life = 80;
    this.initLife = 80;
    this.magic = 120;
    this.initMagic = 120;
    this.attack = 6;
    this.luck = 12;
    this.description = 'Демиург';
    this.weapon = new StormStaff();
  }

  getDamage(distance) {
    const damage = super.getDamage(distance);
    if (this.magic > 0 && this.getLuck() > 0.6) {
      return damage * 1.5;
    }
    return damage;
  }
}

function play(players) {
  let round = 1;
  console.log('=== НАЧАЛО БИТВЫ ===');
  let alivePlayers = players.filter(player => !player.isDead());

  while (alivePlayers.length > 1) {
    console.log(`=== РАУНД ${round} ===`);
    for (const player of players) {
      alivePlayers = players.filter(p => !p.isDead());
      if (alivePlayers.length <= 1) {
        break;
      }
      player.turn(players);
    }
    alivePlayers = players.filter(p => !p.isDead());
    round++;
  }

  const winner = alivePlayers.length > 0 ? alivePlayers[0] : null;
  if (winner) {
    console.log(`Победитель: ${winner.name}`);
  }
  return winner;
}
