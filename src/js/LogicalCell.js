export class LogicalCell {

	constructor(value, ord) {
		// If the value on construction is 0, we want to be able to modify it.
		if(value != 0) {
			this.locked = true; // Locks the cell from being changed otherwise.
		}

		this.ordinal = ord

		this.origValue = value; // The original value upon construction.
		this.userValue = 0; // The user value is always 0 upon construction.
		// An array of pencil marks. The number set to true (+1) has been set as a pencil mark.
		this.pencilMarks = [false, false, false, false, false, false, false, false, false]; 
	}

	is_locked() {
		return this.locked;
	}

	get_ordinal() {
		return this.ordinal;
	}

	set_original(num) {
		if(!this.locked) {
			this.origValue = num;
			this.locked = true;
		}
	}

	// Gets either the original or user value based on lock status.
	get_value() {
		if(this.locked) {
			return this.origValue;
		}
		else {
			return this.userValue;
		}
	}

	// sets the value, but only if the cell is unlocked. Returns a bool indicating success.
	set_value(num) {
		if(!this.locked) {
			this.userValue = num;
			return true;
		}
		return false;
	}

	// get the whole array of pencil marks.
	get_pencil() {
		return this.pencilMarks;
	}

	// Sets a specific pencil mark for the cell. Returns a bool indicating success.
	set_pencil(num) {
		// Currently this makes it so that pencil marks can only be done when there is no user value.
		if(!this.locked && this.userValue == 0) {
			this.pencilMarks[num - 1] = true; // Uses num - 1 since sudoku runs from 1-9 but the array is 0-8.
			return true;
		}
		return false;
	}

	// Removes a specific pencil mark for the cell. Returns a bool indicating success.
	remove_pencil(num) {
		// This does not need to check for the user value, since it would not cause a conflicting display.
		if(!this.locked) {
			this.pencilMarks[num -1] = false;
			return true;
		}
		return false;
	}

	// Clears the entire array of pencil marks. Returns a bool indicating success.
	clear_pencil() {
		if(!this.locked) {
			var i = 0;
			for (i = 0; i < 9; i++) {
				this.pencilMarks[i] = false;
			}
			return true;
		}
		return false;
	}
}
