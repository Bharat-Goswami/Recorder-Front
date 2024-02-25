import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const api = 'https://recorder-back.onrender.com/';

export const AddAudio = createAsyncThunk('audio/AddAudio', async (audio, thunkAPI) => {
    try {
        const res = await axios.post(`${api}/api/audio`, audio);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const DeleteAudio = createAsyncThunk('audio/deleteAudio', async (audioId, thunkAPI) => {
    try {
        const res = await axios.delete(`${api}/api/audio/${audioId}`);
        return { deletedAudioId: audioId, message: res.data.message };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const GetAudio = createAsyncThunk('audio/getAudios', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${api}/api/audio`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

const initialState = {
    audios: [],
    loading: false,
    isSuccess: false,
    error: null,
};

const AudioSlice = createSlice({
    name: 'audio',
    initialState,
    reducers: {
        reset: (state) => {
            state.loading = false;
            state.isSuccess = false;
            state.audios = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(AddAudio.pending, (state) => {
                state.loading = true;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(AddAudio.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.audios.push(action.payload);
            })
            .addCase(AddAudio.rejected, (state, action) => {
                state.loading = false;
                state.isSuccess = false;
                state.error = action.payload;
            })
            .addCase(GetAudio.pending, (state) => {
                state.loading = true;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(GetAudio.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.audios = action.payload;
            })
            .addCase(GetAudio.rejected, (state, action) => {
                state.loading = false;
                state.isSuccess = false;
                state.error = action.payload;
            })
            .addCase(DeleteAudio.pending, (state) => {
                state.loading = true;
                state.isSuccess = false;
                state.error = null;
            })
            .addCase(DeleteAudio.fulfilled, (state, action) => {
                state.loading = false;
                state.isSuccess = true;
                state.audios = state.audios.filter(audio => audio._id !== action.payload.deletedAudioId);
            })
            .addCase(DeleteAudio.rejected, (state, action) => {
                state.loading = false;
                state.isSuccess = false;
                state.error = action.payload;
            })
    }
});

export const { reset } = AudioSlice.actions;
export default AudioSlice.reducer;
