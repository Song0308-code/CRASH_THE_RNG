class Cell {
	section = undefined;

	#isLocked = false;
	get isLocked() { return this.#isLocked; }
	set isLocked(value) {
		this.#isLocked = value;
		this.section.dataset.locked = value;
		this.section.draggable = (!value && this.value != undefined);
		//console.log(this.section.dataset);
	}

	#isDetermined = false;
	get isDetermined() { return this.#isDetermined; }
	set isDetermined(value) {
		this.#isDetermined = value;
		this.section.dataset.determined = value;
	}

	#value = undefined;
	get value() { return this.#value };
	set value(val) {
		this.#value = val;
		this.updateContent();
		this.section.draggable = (this.value != undefined);
	}

	// 아이템 사용·보스 효과 등을 통해 적용된 효과들
	effects = [];

	constructor(section) {
		this.section = section;
		this.updateContent();

		this.section.addEventListener("contextmenu", (ev) => {
			ev.preventDefault();
			if (this.value == undefined || this.isDetermined == true) return;
			this.isLocked = !this.isLocked;
		});

		this.section.ondragover = (ev) => {
			if (this.isLocked) return;
			ev.preventDefault();
		}

		this.section.ondrop = (ev) => {
			if (this.isLocked) return;
			ev.preventDefault();
			let data = ev.dataTransfer.getData("sectionId");

			// id는 c1과 같은 형태의 string이므로 숫자를 가져오고 1을 빼면 해당 인덱스가 된다
			let sourceIndex = data[1] - 1;
			//console.log(data[1], this.value);
			const swap = (cellA, cellB) => {
				[cellA.value, cellB.value] = [cellB.value, cellA.value];
				[cellA.effects, cellB.effects] = [cellB.effects, cellA.effects];
			}
			swap(this, cells[sourceIndex]);
		}

		this.section.ondragstart = (ev) => {
			ev.dataTransfer.clearData();
			ev.dataTransfer.setData("sectionId", ev.target.id);
		}
	}

	roll(minin = 1, maxin = 6) {
		if (this.isDetermined == true) return;
		if (this.isLocked == true) {
			this.isDetermined = true;
			return;
		}

		this.value = Math.floor(Math.random() * maxin + minin);
		this.updateContent();
	}

	updateContent() {
		if (this.value == undefined) {
			this.section.textContent = "-";
		} else {
			this.section.textContent = "" + this.value;
		}
	}
}

// html 항목들 레퍼런스 생성 & 초기화
const cellSections = document.getElementsByClassName("cell");

const rollButton = document.getElementById("rollButton");
const confirmButton = document.getElementById("confirmButton");
const scoreDisplays = document.getElementsByClassName("scoreDisplay");
const rollDisplays = document.getElementsByClassName("rollDisplay");

// 주사위 굴리는 횟수
let maximumRolls = 2;
let rollCount = 0;

// 점수
let score = 0;

// 칸들
let cells = [];
for (i = 0; i < 4; i++) {
	cells.push(new Cell(cellSections[i]));
}

// 초기화
function initialize() {
	rollButton.disabled = false;
	confirmButton.disabled = true;

	cells.forEach(cell => {
		cell.value = undefined;
		cell.isLocked = false;
		cell.isDetermined = false;
		cell.effects = [];
	});

	rollCount = 0;
	score = 0;

	// 굴린 횟수 글자 업데이트
	Array.prototype.forEach.call(rollDisplays, (element) => {
		element.textContent = `Roll: ${rollCount}/${maximumRolls}`;
	});

	// 점수 글자 업데이트
	Array.prototype.forEach.call(scoreDisplays, (element) => {
		element.textContent = score;
	});
}

// 최초 초기화 함수 실행
initialize();

// roll버튼 클릭시
function onRollClick() {
	for (i = 0; i < cells.length; i++) {
		if (cells[i].value == undefined) {
			cells[i].isLocked = false;
		}
		cells[i].roll();
	}

	confirmButton.disabled = false;

	// 굴린 횟수 업데이트
	rollCount++;
	Array.prototype.forEach.call(rollDisplays, (element) => {
		element.textContent = `Roll: ${rollCount}/${maximumRolls}`;
	});

	if (rollCount >= maximumRolls) {
		rollButton.disabled = true;
	}

	calculateScore();
}

// confirm버튼 클릭시
function onConfirmClick() {
	rollButton.disabled = true;
	confirmButton.disabled = true;

	for (i = 0; i < cells.length; i++) {
		cells[i].isLocked = true;
		cells[i].isDetermined = true;
	}

	console.log(score);

	setTimeout(() => {
		initialize();
	}, 1500);
}

// 점수 계산
function calculateScore() {
	cells.forEach(cell => {
		score += cell.value;
	});

	Array.prototype.forEach.call(scoreDisplays, (element) => {
		element.textContent = score;
	});
}