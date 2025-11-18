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
			calculateScore(); // 자리 바꾼이후 점수 계산
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
	if (rollCount >= maximumRolls) {
		return;
	}

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
	
	score = calculateScore();

	console.log(score);

	setTimeout(() => {
		battleSystem.rollDice(score);
	}, 0)
	
	setTimeout(() => {
		initialize();
	}, 1500);
}

// 점수 계산 후 반환 & UI 업데이트
// 매개변수 false시 UI 업데이트 없음
// 점수 계산 후 반환 & UI 업데이트
// 매개변수 false시 UI 업데이트 없음
function calculateScore(updateUI = true) {
    
    // 각 칸 값 가져오기
    const vA = cells[0].value;
    const vB = cells[1].value;
    const vC = cells[2].value;
    const vD = cells[3].value;

    // 만약 주사위가 아직 다 굴려지지 않았다면(undefined 값이 있다면) 0점 처리
    if ([vA, vB, vC, vD].includes(undefined)) {
        if (updateUI) {
            Array.prototype.forEach.call(scoreDisplays, (element) => {
                element.textContent = 0;
            });
        }
        return 0;
    }
    // 라인 보너스
    const valA = (vA === vB || vA === vC) ? vA * 2 : vA;
    const valB = (vB === vA || vB === vD) ? vB * 2 : vB;
    const valC = (vC === vA || vC === vD) ? vC * 2 : vC;
    const valD = (vD === vB || vD === vC) ? vD * 2 : vD;

    let baseScore = valA + valB + valC + valD;

    let multiplier = 1; // 기본 배율 1배

    //교차형
    if ((vA + vD) === (vB + vC)) {
        multiplier += 1;
    }

    // 원천형
    if (vA <= 3 && vB <= 3 && vC <= 3 && vD <= 3) {
        multiplier += 1;
    }

    // 정석형
    if (vA === vB && vB === vC && vC === vD) {
        multiplier += 1;
    }

	//우상형
	if(((vA=== vB+vC+vD) && (vB=== vC === vD)) || ((vB=== vA+vC+vD)&& (vA=== vC === vD)) || ((vC=== vA+vB+vD)&&(vA=== vB === vD)) || ((vD=== vA+vB+vC) && (vA=== vB === vC))) {
		multiplier +=2;
	}
    //최종 점수
    let finalScore = baseScore * multiplier;

    //UI 업데이트
    if (updateUI) {
        Array.prototype.forEach.call(scoreDisplays, (element) => {
            element.textContent = finalScore;
        });
    }

    return finalScore;
}