import axios from "axios";
import {
  PrincipalId,
  Bookmark,
  BookmarkCreate,
  BookmarkState,
  ResourceObject,
  unknown,
  Principal,
} from "../../types";

function convert(bookmark: ResourceObject, rootGetters: any): Bookmark {
  const creator = bookmark.attributes.creator as Principal;
  const updater = bookmark.attributes.updater as Principal;

  return {
    ...(bookmark.attributes as Omit<Bookmark, "id" | "creator" | "updater">),
    id: parseInt(bookmark.id),
    creator,
    updater,
  };
}

const state: () => BookmarkState = () => ({
  bookmarkListByUser: new Map(),
});

const getters = {
  bookmarkListByUser:
    (state: BookmarkState) =>
    (userId: PrincipalId): Bookmark[] => {
      return state.bookmarkListByUser.get(userId) || [];
    },
  bookmarkByUserAndLink:
    (state: BookmarkState, getters: any) =>
    (userId: PrincipalId, link: string): Bookmark => {
      const list = getters["bookmarkListByUser"](userId);
      return (
        list.find((item: Bookmark) => item.link == link) ||
        (unknown("BOOKMARK") as Bookmark)
      );
    },
};

const actions = {
  async fetchBookmarkListByUser(
    { commit, rootGetters }: any,
    userId: PrincipalId
  ) {
    // API only returns bookmark for the requesting user.
    // User info is retrieved from the context.
    const bookmarkList = (await axios.get(`/api/bookmark`)).data.data.map(
      (bookmark: ResourceObject) => {
        return convert(bookmark, rootGetters);
      }
    );
    commit("setBookmarkListByPrincipalId", { userId, bookmarkList });
    return bookmarkList;
  },

  async createBookmark(
    { commit, rootGetters }: any,
    newBookmark: BookmarkCreate
  ) {
    const createdBookmark = convert(
      (
        await axios.post(`/api/bookmark`, {
          data: {
            type: "bookmark",
            attributes: newBookmark,
          },
        })
      ).data.data,
      rootGetters
    );

    commit("appendBookmark", createdBookmark);

    return createdBookmark;
  },

  async deleteBookmark({ commit }: any, bookmark: Bookmark) {
    await axios.delete(`/api/bookmark/${bookmark.id}`);

    commit("deleteBookmark", bookmark);
  },
};

const mutations = {
  setBookmarkListByPrincipalId(
    state: BookmarkState,
    {
      userId,
      bookmarkList,
    }: {
      userId: PrincipalId;
      bookmarkList: Bookmark[];
    }
  ) {
    state.bookmarkListByUser.set(userId, bookmarkList);
  },

  appendBookmark(state: BookmarkState, bookmark: Bookmark) {
    const list = state.bookmarkListByUser.get(bookmark.creator.id);
    if (list) {
      list.push(bookmark);
    } else {
      state.bookmarkListByUser.set(bookmark.creator.id, [bookmark]);
    }
  },

  deleteBookmark(state: BookmarkState, bookmark: Bookmark) {
    const list = state.bookmarkListByUser.get(bookmark.creator.id);
    if (list) {
      const i = list.findIndex((item: Bookmark) => item.id == bookmark.id);
      if (i != -1) {
        list.splice(i, 1);
      }
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
