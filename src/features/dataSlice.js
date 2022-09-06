import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase-config";

const signup = createAsyncThunk("dataSlice/signup", async (values) => {
  let response = await createUserWithEmailAndPassword(auth, values.email, values.password);
  console.log("thunk signup arrived", response.user);
  let data = response.user;
  const userData = {
    uid: data.uid,
    accessToken: data.stsTokenManager.accessToken,
    refreshToken: data.stsTokenManager.refreshToken,
    username: values.username,
  };
  return userData;
});

const login = createAsyncThunk("dataSlice/login", async (values) => {
  let response = await signInWithEmailAndPassword(auth, values.email, values.password);
  console.log("thunk login arrived", response.user);
  let data = response.user;
  const userData = {
    uid: data.uid,
    accessToken: data.stsTokenManager.accessToken,
    refreshToken: data.stsTokenManager.refreshToken,
    username: values.username,
  };
  return userData;
});

const sendData = createAsyncThunk("dataSlice/sendData", async (tripData, api) => {
  const uid = api.getState().storedData.uid;
  console.log("uid:", uid);
  const docRef = await addDoc(collection(db, `users/${uid}/trips`), {
    tripData,
  });
  console.log("thunk sent data");
  return docRef;
});

const getData = createAsyncThunk("dataSlice/getData", async (blank, api) => {
  const uid = api.getState().storedData.uid;
  console.log("uid:", uid);
  const userRef = collection(db, `users/${uid}/trips`);
  const querySnapshot = await getDocs(userRef);
  let newList = [];
  querySnapshot.forEach((doc) => {
    let entry = { uid: doc.id, data: doc.data().tripData };
    newList.push(entry);
  });
  console.log("newList:", newList);
  return newList;
});

const updateTrip = createAsyncThunk("dataSlice/updateTrip", async ({ tripId, tripData }, api) => {
  const uid = api.getState().storedData.uid;
  console.log("uid:", uid);

  const tripRef = doc(db, `users/${uid}/trips/${tripId}`);
  await updateDoc(tripRef, {
    tripData,
  });
});

const dataSlice = createSlice({
  name: "storedData",
  initialState: {
    username: false,
    accessToken: false,
    refreshToken: false,
    uid: false,
    loading: false,
    lgn: false,
    // userData: false,
    planning: {},
    completed: {},
    cancelled: {},
    planningOpen: true,
    completedOpen: false,
    cancelledOpen: false,
  },
  reducers: {
    logout: (state, action) => {
      ["username", "accessToken", "refreshToken", "uid", "loading", "lgn"].map((ele) => (state[ele] = false));
      alert("Logged out.");
      console.log(
        "logout, state:",
        "username:",
        state.username,
        "accessToken:",
        state.accessToken,
        "refreshToken:",
        state.refreshToken,
        "uid:",
        state.uid
      );
    },
    toggleWin: (state, actions) => {
      state[`${actions.payload}Open`] = !state[`${actions.payload}Open`] ? true : false;
    },
  },
  extraReducers: {
    [signup.pending]: (state, action) => {
      state.loading = true;
    },
    [signup.rejected]: (state, action) => {
      const error = action.error;
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`ERRORCODE:${errorCode}:${errorMessage}`);
      state.loading = false;
    },
    [signup.fulfilled]: (state, action) => {
      const data = action.payload;
      state.uid = data.uid;
      state.accessToken = data.accessToken;
      state.refreshToken = data.refreshToken;
      state.username = data.username;
      state.lgn = true;
      alert("Registration successful!");
      console.log(
        "fulfilled, state:",
        "username:",
        state.username,
        "accessToken:",
        state.accessToken,
        "refreshToken:",
        state.refreshToken,
        "uid:",
        state.uid
      );
      state.loading = false;
    },
    [login.pending]: (state, action) => {
      state.loading = true;
    },
    [login.rejected]: (state, action) => {
      const error = action.error;
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`ERRORCODE:${errorCode}:${errorMessage}`);
      state.loading = false;
    },
    [login.fulfilled]: (state, action) => {
      const data = action.payload;
      state.uid = data.uid;
      state.accessToken = data.accessToken;
      state.refreshToken = data.refreshToken;
      state.username = data.username;
      state.lgn = true;
      alert("Login successful!");
      console.log(
        "fulfilled, state:",
        "username:",
        state.username,
        "accessToken:",
        state.accessToken,
        "refreshToken:",
        state.refreshToken,
        "uid:",
        state.uid
      );
      state.loading = false;
    },
    [sendData.pending]: (state, action) => {
      console.log("pending sendData");
      state.loading = true;
    },
    [sendData.rejected]: (state, action) => {
      const error = action.error;
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`ERRORCODE:${errorCode}:${errorMessage}`);
      state.loading = false;
    },
    [sendData.fulfilled]: (state, action) => {
      alert("SendData was successful!");
      state.loading = false;
    },
    [getData.pending]: (state, action) => {
      console.log("pending getData");
      state.loading = true;
    },
    [getData.rejected]: (state, action) => {
      const error = action.error;
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`ERRORCODE:${errorCode}:${errorMessage}`);
      state.loading = false;
    },
    [getData.fulfilled]: (state, action) => {
      // alert("getData was successful!", action.payload);
      state.planning = {};
      state.completed = {};
      state.cancelled = {};

      console.log("PAYLOAD:", action.payload);

      for (const trip of action.payload) {
        // console.log(trip.data.tripStatus);
        if (!state[trip.data.tripStatus.toLowerCase()][trip.uid]) state[trip.data.tripStatus.toLowerCase()][trip.uid] = trip;
      }
      console.log("GOTDATA:", current(state));
      state.loading = false;
    },
    [updateTrip.pending]: (state, action) => {
      state.loading = true;
    },
    [updateTrip.rejected]: (state, action) => {
      const error = action.error;
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`ERRORCODE:${errorCode}:${errorMessage}`);
      state.loading = false;
    },
    [updateTrip.fulfilled]: (state, action) => {
      state.loading = false;
    },
  },
});

export { signup, login, sendData, getData, updateTrip };

export const { logout, toggleWin } = dataSlice.actions;

export default dataSlice.reducer;
