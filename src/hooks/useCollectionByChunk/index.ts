import { useCallback, useEffect, useMemo, useReducer } from "react";

import reducer, { initializer, action, selector, State } from "./reducer";

const useCollectionByChunk = ({
  forwardOrderQuery,
  reverseOrderQuery,
  size,
}: Pick<State, "forwardOrderQuery" | "reverseOrderQuery" | "size">) => {
  const [state, dispatch] = useReducer(
    reducer,
    { forwardOrderQuery, reverseOrderQuery, size },
    initializer
  );

  const docs = useMemo(() => selector.docs(state.snaps), [state.snaps]);

  const subscribeMore = useCallback(() => action.subscribeMore(dispatch, state), [dispatch, state]);

  const reset = ({
    forwardOrderQuery,
    reverseOrderQuery,
    size,
  }: Pick<State, "forwardOrderQuery" | "reverseOrderQuery" | "size">) => {
    dispatch({ type: "detachListeners" });
    dispatch({ type: "initialize", payload: { forwardOrderQuery, reverseOrderQuery, size } });
  };

  useEffect(() => {
    if (state.boundary) {
      const listener = action.watchNextDoc(dispatch, state);
      return () => listener();
    } else {
      const listener = action.watchFirstDoc(dispatch, state);
      return () => listener();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.boundary]);

  useEffect(() => {
    return () => dispatch({ type: "detachListeners" });
  }, []);

  return {
    docs,
    hasMore: state.hasMore,
    error: state.error,
    subscribeMore,
    reset,
  };
};

export default useCollectionByChunk;
