import { useRepo } from 'pinia-orm';
import api from '../apiService/apiService';
import GroupPack from 'src/stores/models/group/GroupPack';

const groupPack = useRepo(GroupPack);

export default {
  // Axios API call
  post(params: string) {
    return api()
      .post('groupPack', params)
      .then((resp) => {
        groupPack.save(resp.data);
      });
  },
  get(offset: number) {
    if (offset >= 0) {
      return api()
        .get('groupPack?offset=' + offset + '&limit=100')
        .then((resp) => {
          groupPack.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            this.get(offset);
          }
        });
    }
  },
  patch(id: number, params: string) {
    return api()
      .patch('groupPack/' + id, params)
      .then((resp) => {
        groupPack.save(resp.data);
      });
  },
  delete(id: number) {
    return api()
      .delete('groupPack/' + id)
      .then(() => {
        groupPack.destroy(id);
      });
  },
  // Local Storage Pinia
  newInstanceEntity() {
    return groupPack.getModel().$newInstance();
  },
  getAllFromStorage() {
    return groupPack.all();
  },
};
