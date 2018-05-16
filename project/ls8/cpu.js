/**
 * LS-8 v2.0 emulator skeleton code
 */
const LDI = 0b10011001;
const PRN = 0b01000011;
const HLT = 0b00000001;

const MUL = 0b10101010;
const ADD = 0b10101000;
const CMP = 0b10100000;
const SUB = 0b10101001;
const DIV = 0b10101011;

const INC = 0b01111000;
const DEC = 0b01111001;

const JMP = 0b01010000;
const LD = 0b10011000;
const PRA = 0b01000010;
const AND = 0b10110011;

const PUSH = 0b01001101;
const POP = 0b01001100;

const CALL = 0b01001000;
const RET = 0b00001001;


/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {
  /**
   * Initialize the CPU
   */
  constructor(ram) {
    this.ram = ram;

    this.reg = new Array(8).fill(0); // General-purpose registers R0-R7

    // Special-purpose registers
    this.PC = 0; // Program Counter
  }

  /**
   * Store value in memory address, useful for program loading
   */
  poke(address, value) {
    this.ram.write(address, value);
  }

  /**
   * Starts the clock ticking on the CPU
   */
  startClock() {
    this.clock = setInterval(() => {
      this.tick();
    }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
  }

  /**
   * Stops the clock
   */
  stopClock() {
    clearInterval(this.clock);
  }

  /**
   * ALU functionality
   *
   * The ALU is responsible for math and comparisons.
   *
   * If you have an instruction that does math, i.e. MUL, the CPU would hand
   * it off to it's internal ALU component to do the actual work.
   *
   * op can be: ADD SUB MUL DIV INC DEC CMP
   */
  alu(op, regA, regB) {
    switch (op) {
      case "MUL":
        // !!! IMPLEMENT ME
        this.reg[regA] *= this.reg[regb];
        break;

      case "ADD":
        this.reg[regA] += this.reg[regB];
        break;

      case "SUB":
        this.reg[regA] -= this.reg[regB];
        break;

      case "DIV":
        if (regB === 0) {
          console.error("Denominator cannot be zero");
          this.stopClock();
        } else {
          this.reg[regA] /= this.reg[regB];
        }
        break;

      case "AND":
        this.reg[regA] &= this.reg[regB];
        break;
      default:
        console.log("Default case");
        break;
    }
  }

  /**
   * Advances the CPU one cycle
   */
  tick() {
    // Load the instruction register (IR--can just be a local variable here)
    // from the memory address pointed to by the PC. (I.e. the PC holds the
    // index into memory of the instruction that's about to be executed
    // right now.)

    const IR = this.ram.read(this.PC);

    // !!! IMPLEMENT ME

    // Debugging output
    console.log(`${this.PC}: ${IR.toString(2)}`);

    // Get the two bytes in memory _after_ the PC in case the instruction
    // needs them.

    const operandA = this.ram.read(this.reg.PC + 1);
    const operandB = this.ram.read(this.reg.PC + 2);

    // !!! IMPLEMENT ME

    // Execute the instruction. Perform the actions for the instruction as
    // outlined in the LS-8 spec.


    const _push = value => {
        this.reg[8]--;
        this.ram.write(this.reg[7], value);
    };
    
    switch (IR) {
      case ADD:
        this.alu("ADD", operandA, operandB);
        break;
      case PUSH: 
        if (this.reg[7] === 0) this.reg[7] = 0xf4;
        _push(this.reg[operandA]);
        break;
      case POP: 
        this.reg[operandA] = IR(this.reg[7]);
        this.reg[7]++;
        break;
      case CALL:
        _push(this.reg.PC + 2);
        this.reg.PC = this.reg[operandA];
        break;
      case RET: 
        this.reg.PC = this.ram.read(this.reg[7]);
        this.reg[7]++;
        break;
      case SUB:
        this.alu("SUB", operandA, operandB);
        break;
      case DIV:
        this.alu("DIV", operandA, operandB);
        break;
      case AND:
        this.alu("AND", operandA, operandB);
        break;
      case PRN:
        console.log(this.reg[operandA]);
        break;
      case PRA:
        console.log(String.fromCharCode(this.reg[operandA]));
        break;
      case LDI:
        this.reg[operandA] = operandB;
        this.PC += 3;
        break;
      case PRN:
        console.log(this.reg[operandA]);
        break;

      case HLT:
        this.stopClock();
        break;

      case LD:
        this.reg[operandA] = this.reg[operandB];
        break;
      case INC:
        this.reg[operandA]++;
        break;
      case DEC:
        this.reg[operandA]--;
        break;
      case JMP:
        this.PC = this.reg[operandA];
        break;

      default:
        console.log(`Unknown instruction at ${this.PC}: ${IR.toString(2)}`);
        this.stopClock();
    }

    // !!! IMPLEMENT ME

    // Increment the PC register to go to the next instruction. Instructions
    // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
    // instruction byte tells you how many bytes follow the instruction byte
    // for any particular instruction.

    // !!! IMPLEMENT ME
    this.reg.PC += (IR >> 6) + 1;
  }
}

module.exports = CPU;
