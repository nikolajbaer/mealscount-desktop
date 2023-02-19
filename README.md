MealsCount Desktop
==================

Desktop app specifically for bulk processing of [Meals Count](https://www.mealscount.com/) optimizations. Specifically targeted for consultants or state departments of education who want to have more control over the duration and iterations of the optimizations, or run large sets of districts simultaneously.

Current setup steps for app:
1. cd mealscount-backend/
2. virtualenv.exe venv
3. venv/Scripts/activate
4. pip install -r requirements.txt
5. pip install pyinstaller
6. cd .. && pyinstaller.exe --paths .\mealscount-backend\venv\Lib\site-packages\ '.\mealscount-backend\statewide.py' 

TODO
----
- integrate to electron app
  - Create Start page
  - upload CSV/view
  - configure and run optimization
  - view/export results
- setup a build process / release on github for download

