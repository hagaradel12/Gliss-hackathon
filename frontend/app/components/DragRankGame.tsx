'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'

interface DragRankGameProps {
  question: any
  questionNumber: number
  onAnswer: (questionId: number, answer: any) => void
  currentAnswer?: any
}

interface RankedItem {
  id: string
  text: string
  emoji: string
  color: string
}

const DragRankGame = ({ question, questionNumber, onAnswer, currentAnswer }: DragRankGameProps) => {
  const [rankedItems, setRankedItems] = useState<RankedItem[]>([])
  const [availableItems, setAvailableItems] = useState<RankedItem[]>([])
  const [isComplete, setIsComplete] = useState(false)

  // Initialize items based on question options
  useEffect(() => {
    const itemMap = {
      'Damage': { emoji: '💔', color: 'from-red-400 to-rose-500' },
      'Frizz': { emoji: '🌀', color: 'from-yellow-400 to-orange-500' },
      'Volume': { emoji: '📈', color: 'from-blue-400 to-cyan-500' },
      'Dandruff': { emoji: '❄️', color: 'from-gray-400 to-slate-500' },
      'Split Ends': { emoji: '✂️', color: 'from-purple-400 to-violet-500' },
      'Dullness': { emoji: '😴', color: 'from-indigo-400 to-blue-500' }
    }

    const items: RankedItem[] = question.options.map((option: string) => ({
      id: option.toLowerCase().replace(' ', '_'),
      text: option,
      emoji: itemMap[option as keyof typeof itemMap]?.emoji || '💇‍♀️',
      color: itemMap[option as keyof typeof itemMap]?.color || 'from-gray-400 to-gray-500'
    }))

    // Restore from current answer if available
    if (currentAnswer && currentAnswer.length > 0) {
      const restored = currentAnswer.map((item: string) => 
        items.find(i => i.id === item.toLowerCase().replace(' ', '_'))
      ).filter(Boolean)
      setRankedItems(restored)
      setAvailableItems(items.filter(item => !restored.some(r => r?.id === item.id)))
      setIsComplete(restored.length >= 2)
    } else {
      setAvailableItems(items)
    }
  }, [question.options, currentAnswer])

  useEffect(() => {
    if (rankedItems.length >= 2) {
      setIsComplete(true)
      onAnswer(questionNumber, rankedItems.slice(0, 2).map(item => item.text))
    } else {
      setIsComplete(false)
    }
  }, [rankedItems, questionNumber, onAnswer])

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (source.droppableId === 'available' && destination.droppableId === 'ranked') {
      // Moving from available to ranked
      const item = availableItems.find(item => item.id === draggableId)
      if (item && rankedItems.length < 2) {
        setAvailableItems(prev => prev.filter(i => i.id !== draggableId))
        setRankedItems(prev => [...prev, item])
      }
    } else if (source.droppableId === 'ranked' && destination.droppableId === 'available') {
      // Moving from ranked to available
      const item = rankedItems.find(item => item.id === draggableId)
      if (item) {
        setRankedItems(prev => prev.filter(i => i.id !== draggableId))
        setAvailableItems(prev => [...prev, item])
      }
    } else if (source.droppableId === 'ranked' && destination.droppableId === 'ranked') {
      // Reordering within ranked
      const newRankedItems = Array.from(rankedItems)
      const [removed] = newRankedItems.splice(source.index, 1)
      newRankedItems.splice(destination.index, 0, removed)
      setRankedItems(newRankedItems)
    }
  }

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{question.title}</h2>
        <p className="text-lg text-gray-600">{question.description}</p>
      </motion.div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Ranked Concerns */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Your Top 2 Concerns</h3>
            
            <Droppable droppableId="ranked" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[120px] p-4 rounded-xl border-2 border-dashed transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'border-purple-400 bg-purple-50' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-center space-x-4 h-full">
                    {rankedItems.length === 0 && (
                      <div className="flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📋</div>
                          <p>Drag your top 2 concerns here</p>
                        </div>
                      </div>
                    )}
                    
                    {rankedItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`drag-item ${snapshot.isDragging ? 'dragging' : ''}`}
                          >
                            <div className="relative">
                              <div className={`bg-gradient-to-br ${item.color} rounded-xl p-6 text-white shadow-lg min-w-[140px] text-center`}>
                                <div className="text-3xl mb-2">{item.emoji}</div>
                                <div className="font-bold text-lg">{item.text}</div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">
                                  #{index + 1}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>

          {/* Available Concerns */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Available Concerns</h3>
            
            <Droppable droppableId="available" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[120px] p-4 rounded-xl border-2 border-dashed transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'border-purple-400 bg-purple-50' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex flex-wrap justify-center gap-4">
                    {availableItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`drag-item ${snapshot.isDragging ? 'dragging' : ''}`}
                          >
                            <div className={`bg-gradient-to-br ${item.color} rounded-xl p-4 text-white shadow-lg min-w-[120px] text-center cursor-grab active:cursor-grabbing`}>
                              <div className="text-2xl mb-2">{item.emoji}</div>
                              <div className="font-medium">{item.text}</div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {/* Completion Feedback */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <div className="inline-flex items-center space-x-2 bg-green-100 border border-green-300 rounded-full px-6 py-3 shadow-lg">
              <span className="text-lg">🎯</span>
              <span className="text-lg font-medium text-green-700">
                Perfect! Top 2 concerns ranked
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <h4 className="font-semibold text-blue-800 mb-3">💡 How to rank your concerns</h4>
        <div className="text-left text-blue-700 text-sm space-y-2">
          <p>• Drag items from "Available Concerns" to "Your Top 2 Concerns"</p>
          <p>• Rank them by importance - #1 is your biggest concern</p>
          <p>• You can reorder by dragging within the ranked area</p>
          <p>• Remove items by dragging them back to available</p>
        </div>
      </motion.div>
    </div>
  )
}

export default DragRankGame
