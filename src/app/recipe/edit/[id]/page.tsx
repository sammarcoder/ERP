// import RecipeForm from '@/components/recipe/RecipeForm'

// export default function EditRecipePage({ params }: { params: { id: string } }) {
//   return <RecipeForm mode="edit" id={parseInt(params.id)} />
// }






// app/recipe/edit/[id]/page.tsx

import RecipeForm from '@/components/recipe/RecipeForm'

interface PageProps {
  params: { id: string }
}

export default function EditRecipePage({ params }: PageProps) {
  return <RecipeForm mode="edit" id={Number(params.id)} />
}
