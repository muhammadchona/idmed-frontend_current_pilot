
get takeInstructions() {
  return `${this.amtPerTime} ${this.form} ${this.timesPerDay}`;
}

static async apiGetAllByPrescriptionId(prescriptionId) {
  return await this.api().get(
    '/prescribedDrug/prescription/' + prescriptionId
  );
}

static async apiGetAll() {
  return await this.api().get('/prescribedDrug?offset=' + 0 + '&max=' + 200);
}

getQtyPrescribed(drugsDuration) {
  if (drugsDuration === null || drugsDuration === '') return 0;
  let lostDays = parseInt((drugsDuration.weeks / 4) * 2);
  if (drugsDuration.weeks <= 1) lostDays = 0;
  const days = parseInt(drugsDuration.weeks * 7 + lostDays);

  let qty = 0;
  if (this.form.toLowerCase() === 'dia') {
    qty = Math.round(
      Number((this.amtPerTime * this.timesPerDay * days) / this.drug.packSize)
    );
  } else if (this.form.toLowerCase() === 'semana') {
    qty = Math.round(
      Number(
        (this.amtPerTime * this.timesPerDay * drugsDuration.weeks) /
          this.drug.packSize
      )
    );
  } else if (this.form.toLowerCase() === 'mes') {
    if (drugsDuration.weeks < 4) {
      qty = -1;
    } else {
      qty = Math.round(
        Number(
          (this.amtPerTime * this.timesPerDay * drugsDuration.weeks) /
            this.drug.packSize
        )
      );
    }
  } else if (this.form.toLowerCase() === 'ano') {
    if (drugsDuration.weeks < 52) {
      qty = -1;
    } else {
      qty = Math.round(
        Number(
          (this.amtPerTime * this.timesPerDay * drugsDuration.weeks) /
            this.drug.packSize
        )
      );
    }
  }

  this.qtyPrescribed = qty;
  return qty;
}

static localDbAdd(prescribedDrug) {
  return db.newDb().collection('prescribedDrugs').add(prescribedDrug);
}

static localDbGetById(id) {
  return db.newDb().collection('prescribedDrugs').doc({ id: id }).get();
}

static localDbGetAll() {
  return db.newDb().collection('prescribedDrugs').get();
}

static localDbUpdate(prescribedDrug) {
  return db
    .newDb()
    .collection('prescribedDrugs')
    .doc({ id: prescribedDrug.id })
    .set(prescribedDrug);
}

static localDbUpdateAll(prescribedDrugs) {
  return db.newDb().collection('prescribedDrugs').set(prescribedDrugs);
}

static localDbDelete(prescribedDrug) {
  return db
    .newDb()
    .collection('prescribedDrugs')
    .doc({ id: prescribedDrug.id })
    .delete();
}

static localDbDeleteAll() {
  return db.newDb().collection('prescribedDrugs').delete();
}
