import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerNetworkError} from '../../utils/error-utils';

export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists',
    async (param, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todolistsAPI.getTodolists()
        try {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolists: res.data}
        } catch (error: any) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    }
)
export const removeTodolistTC = createAsyncThunk('todolists/removeTodolists',
    async (todolistId: string, {dispatch, rejectWithValue}) => {            //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(setAppStatusAC({status: 'loading'}))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
        const res = await todolistsAPI.deleteTodolist(todolistId)
        //скажем глобально приложению, что асинхронная операция завершена
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {id: todolistId}
    }
)
export const addTodolistTC = createAsyncThunk('todolists/addTodolists',
    async (title: string, {dispatch, rejectWithValue}) => {            //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todolistsAPI.createTodolist(title)
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolist: res.data.data.item}
    }
)
export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolists',
    async (param: { id: string, title: string }, {dispatch, rejectWithValue}) => {            //изменим глобальный статус приложения, чтобы вверху полоса побежала
        const res = await todolistsAPI.updateTodolist(param.id, param.title)
        return {id: param.id, title: param.title}
    }
)

const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {

        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            return state.map(tl => tl.id === action.payload.id ? {
                ...tl,
                filter: action.payload.filter
            } : tl)
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            return state.map(tl => tl.id === action.payload.id ? {
                ...tl,
                entityStatus: action.payload.status
            } : tl)
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({
                ...tl,
                filter: 'all',
                entityStatus: 'idle'
            }))
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state.splice(index, 1)
            }
        })
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({
                ...action.payload.todolist,
                filter: 'all',
                entityStatus: 'idle'
            })
        })
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            return state.map(tl => tl.id === action.payload.id ? {
                ...tl,
                title: action.payload.title
            } : tl)
        })
    }
})

export const todolistsReducer = slice.reducer
export const {
    changeTodolistTitleAC,
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC
} = slice.actions


// types

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
