
// Use throughout your app instead of plain `useDispatch` and `useSelector`
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppRootStateType} from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
