import {useRef} from 'react'
import { useAppState } from "./state/AppStateContext";
import { useDrop } from "react-dnd";
import { throttle } from 'throttle-debounce-ts';
import { addTasks, moveList, moveTasks, setDraggedItem } from './state/actions';
import { useItemDrag } from './utils/useItemDrag';
import { ColumnContainer, ColumnTitle } from './style';
import { isHidden } from './utils/isHidden';
import { Card } from './Card';
import { AddNewItem } from './AddNewItem';

type ColumnProps = {
  id: string;
  text: string;
  isPreview?: boolean
}

export const Column = ({id, text, isPreview} : ColumnProps) => {
  const { draggedItem, getTasksByListId, dispatch } = useAppState()
  const tasks = getTasksByListId(id)
  const ref = useRef<HTMLDivElement>(null)
  const [,drop] = useDrop({
    accept: ["COLUMN", "CARD"],
    hover: throttle(200, () => {
      if (!draggedItem) return;
      if (draggedItem.type === "COLUMN") {
        if (draggedItem.id === id) return;

        dispatch(moveList(draggedItem.id, id))
      } else {
        if (draggedItem.columnId === id) return;
        if(tasks.length) return;

        dispatch(moveTasks(draggedItem.id, null, draggedItem.columnId, id))
        dispatch(setDraggedItem({ ...draggedItem, columnId: id }))
      }
    })
  })

  const {drag} = useItemDrag({ type: "COLUMN", id, text });

  drag(drop(ref));

  return (
    <ColumnContainer isPreview={isPreview} ref={ref} isHidden={isHidden(isPreview, draggedItem, "COLUMN", id)}>
      <ColumnTitle>{text}</ColumnTitle>
      {tasks.map((task) => <Card id={task.id} columnId={id} text={task.text} key={task.id} />)}
      <AddNewItem toggleButtonText='+ Add another card' onAdd={(text) => dispatch(addTasks(text, id))} />
    </ColumnContainer>
  )
}