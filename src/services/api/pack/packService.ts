import { useRepo } from 'pinia-orm';
import api from '../apiService/apiService';
import Pack from 'src/stores/models/packaging/Pack';

const pack = useRepo(Pack);

export default {
  // Axios API call
  async post(params: string) {
    const resp = await api().post('pack', params);
    pack.save(resp.data);
  },
  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('pack?offset=' + offset + '&max=100')
        .then((resp) => {
          pack.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            this.get(offset);
          }
        });
    }
  },
  async patch(id: number, params: string) {
    const resp = await api().patch('pack/' + id, params);
    pack.save(resp.data);
  },
  async delete(id: number) {
    await api().delete('pack/' + id);
    pack.destroy(id);
  },
  async apiSave(pack: any) {
    return await api().post('/pack', pack);
  },

  async apiGetAllByClinicId(clinicId: string, offset: number, max: number) {
    return await api().get(
      '/pack/clinic/' + clinicId + '?offset=' + offset + '&max=' + max
    );
  },

  async apiGetAllLastOfClinic(clinicId: string, offset: number, max: number) {
    return await api().get(
      '/pack/AllLastOfClinic/' + clinicId + '?offset=' + offset + '&max=' + max
    );
  },
  async apiGetByPatientId(patientid: string) {
    return await api()
      .get('pack/patient/' + patientid)
      .then((resp) => {
        pack.save(resp.data);
      });
  },
  async apiGetAllByPatientVisitDetailsId(
    patientVisitDetailsId: string,
    offset: number,
    max: number
  ) {
    return await api().get(
      '/pack/patientVisitDetails/' +
        patientVisitDetailsId +
        '?offset=' +
        offset +
        '&max=' +
        max
    );
  },

  async apiGetAllByPrescriptionId(prescriptionId: string) {
    return await api().get('/pack/prescription/' + prescriptionId);
  },

  async apiFetchById(id: string) {
    return await api()
      .get(`/pack/${id}`)
      .then((resp) => {
        pack.save(resp.data);
        return resp;
      });
  },

  // Local Storage Pinia
  newInstanceEntity() {
    return pack.getModel().$newInstance();
  },
  getAllFromStorage() {
    return pack.all();
  },

  removeFromStorage(id: string) {
    return pack.destroy(id);
  },

  getPackByID(Id: string) {
    return pack.query().whereId(Id).first();
  },

  getPackWithsByID(Id: string) {
    return pack
      .query()
      .with('dispenseMode')
      .with('packagedDrugs')
      .whereId(Id)
  },

  getLastPackFromPatientVisitAndPrescription(prescriptionId: string) {
    return pack
      .withAllRecursive(1)
      .whereHas('patientVisitDetails', (query) => {
        query.where('prescription_id', prescriptionId);
      })
      .orderBy('pickupDate', 'desc')
      .first();
  },
  getLastPackFromEpisode(episodeId: string) {
    return pack
      .withAllRecursive(1)
      .whereHas('patientVisitDetails', (query) => {
        query.where('episode_id', episodeId);
      })
      .orderBy('pickupDate', 'desc')
      .first();
  },
};
