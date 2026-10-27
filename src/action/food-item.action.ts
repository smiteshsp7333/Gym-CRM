'use server';

import  prisma from '@/lib/prisma';

// Type definitions
export interface FoodItemInput {
  name: string;
  calories: number;
  recipe?: string;
  protein?: number;
  carbs?: number;
  fats?: number;
}

export interface FoodItemResponse {
  id: string;
  name: string;
  calories: number;
  recipe?: string | null;
  protein?: number | null;
  carbs?: number | null;
  fats?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

import { DUMMY_FOOD_ITEMS } from '@/lib/dummy-data';

// 1. GetAllFoodItems
export async function GetAllFoodItems(): Promise<FoodItemResponse[]> {
  try {
    const foodItems = await prisma.foodItems.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (!foodItems || foodItems.length === 0) {
      return DUMMY_FOOD_ITEMS as any;
    }

    return foodItems.map((item) => ({
      ...item,
      recipe: item.recipe ?? undefined,
      protein: item.protein ?? undefined,
      carbs: item.carbs ?? undefined,
      fats: item.fats ?? undefined,
    }));
  } catch (error:any) {
    console.warn("Using DUMMY_FOOD_ITEMS fallback:", error);
    return DUMMY_FOOD_ITEMS as any;
  }
}

// 2. AddFoodItem
export async function AddFoodItem(data: FoodItemInput): Promise<FoodItemResponse> {
  try {
    // Validate inputs
    if (!data.name || !data.calories) {
      throw new Error('Missing required fields');
    }

    const foodItem = await prisma.foodItems.create({
      data: {
        name: data.name,
        calories: Number(data.calories),
        recipe: data.recipe,
        protein: Number(data.protein),
        carbs: Number(data.carbs),
        fats: Number(data.fats),
      },
    });

    return {
      ...foodItem,
      recipe: foodItem.recipe ?? undefined,
      protein: foodItem.protein ?? undefined,
      carbs: foodItem.carbs ?? undefined,
      fats: foodItem.fats ?? undefined,
    };
  } catch (error:any) {
    throw new Error(`Failed to add food item: ${error.message}`);
  }
}

// 3. GetFoodItemById
export async function GetFoodItemById(id: string): Promise<FoodItemResponse | null> {
  try {
    const foodItem = await prisma.foodItems.findUnique({
      where: { id },
    });

    if (!foodItem) {
      return null;
    }

    return {
      ...foodItem,
      recipe: foodItem.recipe ?? undefined,
      protein: foodItem.protein ?? undefined,
      carbs: foodItem.carbs ?? undefined,
      fats: foodItem.fats ?? undefined,
    };
  } catch (error:any) {
    throw new Error(`Failed to fetch food item: ${error.message}`);
  }
}

// 4. GetFoodItemsByArray
export async function GetFoodItemsByArray(ids: string[]): Promise<FoodItemResponse[]> {
  try {
    if (!ids || ids.length === 0) {
      return [];
    }

    const foodItems = await prisma.foodItems.findMany({
      where: {
        id: { in: ids },
      },
      orderBy: { createdAt: 'desc' },
    });

    return foodItems.map((item) => ({
      ...item,
      recipe: item.recipe ?? undefined,
      protein: item.protein ?? undefined,
      carbs: item.carbs ?? undefined,
      fats: item.fats ?? undefined,
    }));
  } catch (error:any) {
    throw new Error(`Failed to fetch food items by IDs: ${error.message}`);
  }
}

// 5. DeleteFoodItem
export async function DeleteFoodItem(id: string): Promise<void> {
  try {
    await prisma.foodItems.delete({
      where: { id },
    });
  } catch (error:any) {
    throw new Error(`Failed to delete food item: ${error.message}`);
  }
}